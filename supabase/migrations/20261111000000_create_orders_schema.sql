-- ==============================================================================
-- ART BOUQUET — Milestone 3B Database Schema Migration
-- Migration: 20261111000000_create_orders_schema.sql
-- Description: Creates orders and order_items tables with strict constraints,
--              Row Level Security (RLS), and atomic order insertion function.
-- ==============================================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    customer_notes TEXT,
    payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method = 'cod'),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled')),
    subtotal_mad NUMERIC(10, 2) NOT NULL CHECK (subtotal_mad > 0),
    delivery_fee_mad NUMERIC(10, 2) NULL CHECK (delivery_fee_mad IS NULL OR delivery_fee_mad >= 0),
    total_amount_mad NUMERIC(10, 2) NULL CHECK (total_amount_mad IS NULL OR total_amount_mad >= subtotal_mad),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Order Items Table (Historical Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price_mad NUMERIC(10, 2) NOT NULL CHECK (unit_price_mad > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 10),
    line_total_mad NUMERIC(10, 2) NOT NULL CHECK (line_total_mad = unit_price_mad * quantity),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for Performance & Search
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders (order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- 4. Automatically update updated_at on orders
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) Configuration
-- Enable RLS on both tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Deny public and anonymous read access to orders and order items
-- Customers cannot list or query arbitrary orders from the browser.
DROP POLICY IF EXISTS "Deny public read on orders" ON public.orders;
CREATE POLICY "Deny public read on orders"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Deny public read on order_items" ON public.order_items;
CREATE POLICY "Deny public read on order_items"
ON public.order_items
FOR SELECT
TO anon, authenticated
USING (false);

-- Deny public direct updates and deletes
DROP POLICY IF EXISTS "Deny public update on orders" ON public.orders;
CREATE POLICY "Deny public update on orders"
ON public.orders
FOR UPDATE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Deny public delete on orders" ON public.orders;
CREATE POLICY "Deny public delete on orders"
ON public.orders
FOR DELETE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Deny public update on order_items" ON public.order_items;
CREATE POLICY "Deny public update on order_items"
ON public.order_items
FOR UPDATE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Deny public delete on order_items" ON public.order_items;
CREATE POLICY "Deny public delete on order_items"
ON public.order_items
FOR DELETE
TO anon, authenticated
USING (false);

-- Allow service_role full access (used exclusively server-side)
-- The service_role bypasses RLS by default in Supabase, but explicit policies ensure clarity.

-- 6. Atomic Order Creation Function (Database Transaction)
CREATE OR REPLACE FUNCTION public.create_order_with_items(
    p_order_reference TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_city TEXT,
    p_delivery_address TEXT,
    p_customer_notes TEXT,
    p_subtotal_mad NUMERIC,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product_id TEXT;
    v_product_name TEXT;
    v_unit_price NUMERIC;
    v_quantity INTEGER;
    v_line_total NUMERIC;
BEGIN
    -- Input validations
    IF p_order_reference IS NULL OR trim(p_order_reference) = '' THEN
        RAISE EXCEPTION 'Order reference is required';
    END IF;

    IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;

    IF p_customer_phone IS NULL OR trim(p_customer_phone) = '' THEN
        RAISE EXCEPTION 'Customer phone is required';
    END IF;

    IF p_city IS NULL OR trim(p_city) = '' THEN
        RAISE EXCEPTION 'City is required';
    END IF;

    IF p_delivery_address IS NULL OR trim(p_delivery_address) = '' THEN
        RAISE EXCEPTION 'Delivery address is required';
    END IF;

    IF p_subtotal_mad IS NULL OR p_subtotal_mad <= 0 THEN
        RAISE EXCEPTION 'Subtotal must be greater than zero';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- Insert Order (delivery_fee_mad and total_amount_mad are explicitly NULL until confirmed)
    INSERT INTO public.orders (
        order_reference,
        customer_name,
        customer_phone,
        city,
        delivery_address,
        customer_notes,
        payment_method,
        payment_status,
        order_status,
        subtotal_mad,
        delivery_fee_mad,
        total_amount_mad
    )
    VALUES (
        p_order_reference,
        p_customer_name,
        p_customer_phone,
        p_city,
        p_delivery_address,
        p_customer_notes,
        'cod',
        'pending',
        'pending',
        p_subtotal_mad,
        NULL,
        NULL
    )
    RETURNING id INTO v_order_id;

    -- Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_product_name := v_item->>'product_name';
        v_unit_price := (v_item->>'unit_price_mad')::numeric;
        v_quantity := (v_item->>'quantity')::integer;
        v_line_total := v_unit_price * v_quantity;

        IF v_product_id IS NULL OR v_product_name IS NULL OR v_unit_price IS NULL OR v_quantity IS NULL THEN
            RAISE EXCEPTION 'Invalid order item data';
        END IF;

        IF v_quantity <= 0 OR v_quantity > 10 THEN
            RAISE EXCEPTION 'Item quantity must be between 1 and 10';
        END IF;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            unit_price_mad,
            quantity,
            line_total_mad
        )
        VALUES (
            v_order_id,
            v_product_id,
            v_product_name,
            v_unit_price,
            v_quantity,
            v_line_total
        );
    END LOOP;

    RETURN jsonb_build_object(
        'order_id', v_order_id,
        'order_reference', p_order_reference,
        'subtotal_mad', p_subtotal_mad
    );
END;
$$;

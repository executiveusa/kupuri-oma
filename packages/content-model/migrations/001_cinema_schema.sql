-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 001_cinema_schema
-- Description: PAULI CINEMATIC STUDIO™ — Characters, Videos, Affiliates, Waitlist
-- Requires: pgvector extension for character embeddings
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- Enable pgvector for character embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Enum types ────────────────────────────────────────────────────────────────

CREATE TYPE cinema_niche AS ENUM (
  'fashion',
  'spa',
  'ecotourism',
  'education',
  'anime',
  'game_dev'
);

CREATE TYPE video_status AS ENUM (
  'queued',
  'keyframe_generating',
  'video_generating',
  'color_grading',
  'scoring',
  'completed',
  'failed',
  'archived'
);

CREATE TYPE commission_status AS ENUM (
  'pending',
  'approved',
  'paid',
  'refunded'
);

CREATE TYPE waitlist_niche AS ENUM (
  'education',
  'anime',
  'game_dev'
);

-- ── cinema_characters ─────────────────────────────────────────────────────────

CREATE TABLE cinema_characters (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT        NOT NULL,
  niche             cinema_niche NOT NULL,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  style             VARCHAR(100) DEFAULT 'cinematic',
  photos_count      SMALLINT    DEFAULT 0,
  -- 768-dimensional CLIP embedding for character consistency
  embedding         VECTOR(768),
  embedding_status  VARCHAR(50)  DEFAULT 'pending',
  -- Higgsfield / external service reference
  higgsfield_id     VARCHAR(255),
  -- Neo4j graph node reference
  genealogy_node_id VARCHAR(255),
  quality_score     FLOAT,
  keyframe_url      TEXT,
  created_at        TIMESTAMPTZ  DEFAULT now(),
  updated_at        TIMESTAMPTZ  DEFAULT now(),

  CONSTRAINT cinema_characters_niche_name_user_unique
    UNIQUE (niche, name, user_id)
);

-- Index for embedding similarity search (cosine distance)
CREATE INDEX cinema_characters_embedding_idx
  ON cinema_characters USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX cinema_characters_user_niche_idx
  ON cinema_characters (user_id, niche);

-- ── cinema_videos ─────────────────────────────────────────────────────────────

CREATE TABLE cinema_videos (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id      UUID          REFERENCES cinema_characters(id) ON DELETE SET NULL,
  user_id           TEXT          NOT NULL,
  niche             cinema_niche  NOT NULL,
  prompt            TEXT          NOT NULL,
  motion_type       VARCHAR(50)   DEFAULT 'pan',
  color_grade       VARCHAR(50)   DEFAULT 'cinematic',
  duration_seconds  SMALLINT      DEFAULT 15,
  video_url         TEXT,
  thumbnail_url     TEXT,
  -- UDEC 14-axis quality scores stored as JSON
  quality_axes      JSONB,
  quality_score     FLOAT,
  status            video_status  DEFAULT 'queued',
  -- Job tracking
  job_id            UUID,
  cost_usd          DECIMAL(10,2),
  runtime_seconds   INTEGER,
  error_message     TEXT,
  -- Affiliate
  affiliate_link_id UUID,
  affiliate_earnings DECIMAL(10,2) DEFAULT 0,
  created_at        TIMESTAMPTZ   DEFAULT now(),
  updated_at        TIMESTAMPTZ   DEFAULT now(),
  expires_at        TIMESTAMPTZ   DEFAULT (now() + INTERVAL '90 days')
);

CREATE INDEX cinema_videos_user_niche_idx
  ON cinema_videos (user_id, niche, created_at DESC);

CREATE INDEX cinema_videos_status_idx
  ON cinema_videos (status) WHERE status IN ('queued', 'keyframe_generating', 'video_generating', 'color_grading', 'scoring');

-- ── cinema_affiliate_links ────────────────────────────────────────────────────

CREATE TABLE cinema_affiliate_links (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT          NOT NULL,
  niche           cinema_niche  NOT NULL,
  platform        VARCHAR(100)  NOT NULL,
  product_id      TEXT          NOT NULL,
  video_id        UUID          REFERENCES cinema_videos(id) ON DELETE SET NULL,
  tracking_url    TEXT          NOT NULL,
  commission_rate FLOAT         NOT NULL,
  clicks          INTEGER       DEFAULT 0,
  conversions     INTEGER       DEFAULT 0,
  created_at      TIMESTAMPTZ   DEFAULT now()
);

CREATE INDEX cinema_affiliate_links_user_niche_idx
  ON cinema_affiliate_links (user_id, niche);

-- ── cinema_affiliate_commissions ──────────────────────────────────────────────

CREATE TABLE cinema_affiliate_commissions (
  id                  UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id             UUID              REFERENCES cinema_affiliate_links(id) ON DELETE CASCADE,
  user_id             TEXT              NOT NULL,
  niche               cinema_niche      NOT NULL,
  platform            VARCHAR(100)      NOT NULL,
  order_id            TEXT,
  sale_amount_usd     DECIMAL(10,2),
  commission_usd      DECIMAL(10,2)     NOT NULL,
  creator_earnings_usd DECIMAL(10,2)   NOT NULL,
  platform_earnings_usd DECIMAL(10,2)  NOT NULL,
  status              commission_status DEFAULT 'pending',
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ       DEFAULT now()
);

CREATE INDEX cinema_affiliate_commissions_user_status_idx
  ON cinema_affiliate_commissions (user_id, status, created_at DESC);

-- ── cinema_waitlist ───────────────────────────────────────────────────────────

CREATE TABLE cinema_waitlist (
  id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(320)   NOT NULL,
  niche      waitlist_niche NOT NULL,
  joined_at  TIMESTAMPTZ    DEFAULT now(),

  CONSTRAINT cinema_waitlist_email_niche_unique UNIQUE (email, niche)
);

CREATE INDEX cinema_waitlist_niche_idx ON cinema_waitlist (niche, joined_at ASC);

-- ── updated_at trigger ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cinema_characters_updated_at
  BEFORE UPDATE ON cinema_characters
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cinema_videos_updated_at
  BEFORE UPDATE ON cinema_videos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;

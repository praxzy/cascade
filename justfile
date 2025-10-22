set shell := ["bash", "-euo", "pipefail", "-c"]

anchor_dir := "anchor"

# Default target prints the available recipes.
default:
    @just --list

# --- Next.js workflows ---

# Install JavaScript dependencies with pnpm.
install:
    pnpm install

# Run the Next.js development server.
dev:
    pnpm dev

# Run Next.js lint checks.
lint:
    pnpm lint

# Format the entire workspace (Next.js + Anchor).
format: format-web format-anchor

# Check formatting without writing changes.
format-check: format-check-web format-check-anchor

# Format only the Next.js workspace with Prettier.
format-web:
    pnpm format

# Check Next.js formatting without modifying files.
format-check-web:
    pnpm format:check

# --- Anchor workflows ---

# Format the Anchor project with cargo fmt.
format-anchor:
    cd {{anchor_dir}} && cargo fmt

# Check Anchor formatting without modifying files.
format-check-anchor:
    cd {{anchor_dir}} && cargo fmt -- --check

# Build the Anchor program.
anchor-build:
    cd {{anchor_dir}} && anchor build

# Run Anchor integration tests (spins up a local validator automatically).
anchor-test:
    cd {{anchor_dir}} && anchor test

# Launch a persistent local test validator.
anchor-validator:
    cd {{anchor_dir}} && anchor localnet

# Deploy the Anchor program to the given cluster (localnet/devnet/testnet/mainnet).
anchor-deploy cluster="devnet":
    cd {{anchor_dir}} && anchor deploy --provider.cluster {{cluster}}

# Convenience wrappers for common clusters.
anchor-deploy-localnet:
    just anchor-deploy cluster=localnet

anchor-deploy-devnet:
    just anchor-deploy cluster=devnet

anchor-deploy-testnet:
    just anchor-deploy cluster=testnet

anchor-deploy-mainnet:
    just anchor-deploy cluster=mainnet

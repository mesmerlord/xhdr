#!/bin/bash

# Copy public folder to R2 using rclone
# This script reads credentials from .env and copies files efficiently

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
VERBOSE=false
UPDATE=false
PARALLEL=20

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --update)
            UPDATE=true
            shift
            ;;
        --parallel)
            PARALLEL="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [--dry-run] [--verbose] [--update] [--parallel N]"
            echo "  --dry-run     Show what would be copied without actually copying"
            echo "  --verbose     Show detailed output"
            echo "  --update      Skip files that are newer on destination"
            echo "  --parallel N  Number of parallel transfers (default: 20)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--dry-run] [--verbose] [--update] [--parallel N]"
            exit 1
            ;;
    esac
done

# Source environment variables from .env
if [ -f .env.production ]; then
    ENV_FILE=".env.production"
elif [ -f .env ]; then
    ENV_FILE=".env"
else
    echo -e "${RED}Error: No .env or .env.production file found${NC}"
    exit 1
fi

# Parse the env file
export $(grep -E '^CLOUDFLARE_R2_' $ENV_FILE | xargs)
export $(grep -E '^CDN_PUBLIC_URL=' $ENV_FILE | xargs)

# Check if required variables are set
if [ -z "$CLOUDFLARE_R2_ACCESS_KEY_ID" ] || [ -z "$CLOUDFLARE_R2_SECRET_ACCESS_KEY" ] || [ -z "$CLOUDFLARE_R2_ENDPOINT" ] || [ -z "$CLOUDFLARE_R2_BUCKET_NAME" ]; then
    echo -e "${RED}Error: R2 credentials not found in $ENV_FILE${NC}"
    echo "Required variables:"
    echo "  CLOUDFLARE_R2_ACCESS_KEY_ID"
    echo "  CLOUDFLARE_R2_SECRET_ACCESS_KEY"
    echo "  CLOUDFLARE_R2_ENDPOINT"
    echo "  CLOUDFLARE_R2_BUCKET_NAME"
    exit 1
fi

echo -e "${YELLOW}R2 Copy Script - XHDR${NC}"
echo -e "${CYAN}Bucket: $CLOUDFLARE_R2_BUCKET_NAME${NC}"
echo -e "${CYAN}Endpoint: $CLOUDFLARE_R2_ENDPOINT${NC}"
echo -e "${CYAN}CDN URL: ${CDN_PUBLIC_URL:-https://images.xhdr.org}${NC}"
echo -e "${BLUE}Parallel transfers: $PARALLEL${NC}"
[ "$DRY_RUN" = true ] && echo -e "${YELLOW}DRY RUN MODE - No files will be transferred${NC}"
[ "$UPDATE" = true ] && echo -e "${YELLOW}UPDATE MODE - Skip files newer on destination${NC}"
echo "----------------------------------------"

# Create temporary rclone config
RCLONE_CONFIG=$(mktemp)
cat > "$RCLONE_CONFIG" << EOF
[r2]
type = s3
provider = Cloudflare
access_key_id = $CLOUDFLARE_R2_ACCESS_KEY_ID
secret_access_key = $CLOUDFLARE_R2_SECRET_ACCESS_KEY
endpoint = $CLOUDFLARE_R2_ENDPOINT
acl = private
no_check_bucket = true
EOF

# Build rclone command - sync to public_media folder in bucket root
RCLONE_CMD="rclone copy ./public r2:$CLOUDFLARE_R2_BUCKET_NAME/public_media"
RCLONE_OPTS="--config $RCLONE_CONFIG --transfers $PARALLEL --checkers $PARALLEL --progress"

# Add options based on flags
[ "$VERBOSE" = true ] && RCLONE_OPTS="$RCLONE_OPTS -v"
[ "$DRY_RUN" = true ] && RCLONE_OPTS="$RCLONE_OPTS --dry-run"
[ "$UPDATE" = true ] && RCLONE_OPTS="$RCLONE_OPTS --update"

# Add optimization flags
RCLONE_OPTS="$RCLONE_OPTS --fast-list --s3-upload-concurrency 16 --s3-chunk-size 16M"

# Check if rclone is installed
if ! command -v rclone &> /dev/null; then
    echo -e "${YELLOW}rclone not found. Installing via homebrew...${NC}"
    if command -v brew &> /dev/null; then
        brew install rclone
    else
        echo -e "${RED}Error: rclone not installed and homebrew not found${NC}"
        echo "Please install rclone manually: https://rclone.org/install/"
        rm "$RCLONE_CONFIG"
        exit 1
    fi
fi

# Run the copy
echo -e "${GREEN}Starting copy...${NC}"
echo "Command: $RCLONE_CMD $RCLONE_OPTS"
echo "----------------------------------------"

# Execute rclone
eval "$RCLONE_CMD $RCLONE_OPTS"
RESULT=$?

# Cleanup
rm "$RCLONE_CONFIG"

# Show result
echo "----------------------------------------"
if [ $RESULT -eq 0 ]; then
    echo -e "${GREEN}Copy completed successfully!${NC}"
    if [ "$DRY_RUN" = false ]; then
        echo -e "${CYAN}Files are now accessible at:${NC}"
        echo -e "${CYAN}https://images.xhdr.org/public_media/[filename]${NC}"
    fi
else
    echo -e "${RED}Copy failed with error code: $RESULT${NC}"
    exit $RESULT
fi

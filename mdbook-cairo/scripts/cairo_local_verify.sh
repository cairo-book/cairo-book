#!/bin/bash
#
# Runs locally a CI like workflow to test the Cairo code blocks in the cairo-book sources.
#
# This process is using docker, to be consistent with the CI.
# The version of the docker image must fit the one used in the CI to ensure consistency.
#
# This script must be executed being at the root of this repository.
#



# https://hub.docker.com/r/starknet/cairo
STARKNET_CAIRO_IMAGE=starknet/cairo:1.1.0

# 1. Install mdbook-cairo locally.
cargo install --path mdbook-cairo --locked --force

# 2. Cleanup existing book. As the docker is run as root, some outputed files are not
#    accessible if not used with sudo, which makes mdbook clean unsuitable.
sudo rm -rf book

# 3. Build the book to have the cairo mdbook backend running and extracting the programs.
mdbook build -d book

# 4. The cairo_programs_verifier.sh script must be copied in order to be mounted in the
#    docker container with the extracted cairo programs.
cp mdbook-cairo/scripts/cairo_programs_verifier.sh book/cairo/cairo-programs/

# 5. Run the docker image to actually run the cairo programs.
sudo docker run --rm \
     -v "$(pwd)"/book/cairo/cairo-programs:/cairo \
     --entrypoint sh \
     "$STARKNET_CAIRO_IMAGE" \
     /cairo/cairo_programs_verifier.sh true


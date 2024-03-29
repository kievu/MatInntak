#!/bin/bash
# Runs all unit and functional tests for iOS. Designed for use with ci.usit.uio.no

abort() {
    echo "ERROR: "$1
    exit 50
}
failTests() {
    echo "FAIL: Test run failed"
    exit 1
}
failBuild() {
    echo "ERROR: Build failed"
    exit 2
}
inform() {
    echo "INFO: "$1"..."
}
command_exists() {
    command -v $1 &> /dev/null;
}
assert_in_sandbox() {
  CMD_PATH=$(command -v $1)
  echo $CMD_PATH | grep -q .calabash \
      || abort "Failed to find "$1" in Calabash sandbox, instead found it at: "$CMD_PATH
}
success() {
    echo "SUCCESS!"
}

set -o pipefail

if [ ! -d ./ci ]; then
  echo "Run this script from the project root directory"
  exit SETUP_ERROR
fi

if ! command_exists npm ; then
  inform "Node/npm not installed, installing from UiO-safe server"
  curl -s https://utv.uio.no/node/v6.3.0/node-v6.3.0-darwin-x64.tar.gz | tar xz
  export PATH=$PATH:$(pwd)/node-v6.3.0-darwin-x64/bin
fi

inform "Installing project dependencies"
npm install || { abort; }
success

inform "Running javascript unit tests"
npm run ci-unittest || { failTests; }
success

inform "Running flow typecheck"
npm run ci-flow || { failTests; }
success

if [ ! -d ~/.calabash/sandbox ]; then
  inform "Calabash sandbox not found, installing"
  curl -sSL https://raw.githubusercontent.com/calabash/install/master/install-osx.sh | bash
fi

# BEGIN Excerpt from calabash-sandbox.
# If the below code breaks in CI, it may be useful to compare with the latest calabash-sandbox script.
CALABASH_RUBY_VERSION="2.1.6-p336"
CALABASH_RUBY_PATH="${HOME}/.calabash/sandbox/Rubies/${CALABASH_RUBY_VERSION}/bin"
CALABASH_GEM_HOME="${HOME}/.calabash/sandbox/Gems"
export GEM_HOME="${CALABASH_GEM_HOME}"
export GEM_PATH="${CALABASH_GEM_HOME}:${CALABASH_GEM_HOME}/ruby/2.0.0:${CALABASH_GEM_HOME}/ruby/2.1.0"
PATH="${CALABASH_RUBY_PATH}:${GEM_HOME}/bin:${PATH}"
# END excerpt

command_exists xcpretty || { inform "xcpretty not found, installing"; gem install xcpretty; }

inform "Kill any React Native Packager instances"
killall node

inform "Resetting iOS simulators"
# osascript -e 'tell application "Simulator" to quit'
# osascript -e 'tell application "iOS Simulator" to quit'
xcrun simctl erase all

inform "Building iOS app"
cd ios

xcodebuild -sdk iphonesimulator \
           -scheme Calabash \
           -configuration Calabash \
           build \
           2>&1 \
    | tee ../ci/xcodebuild.log \
    | xcpretty \
    || { failBuild; };
success

assert_in_sandbox ruby
assert_in_sandbox bundle

inform "Installing calabash dependencies"
LOG_FILE=bundle.log
bundle install | tee "../ci/"$LOG_FILE > /dev/null ||
    { abort "`bundle install` failed, see "$LOG_FILE" for details"; }
success

inform "Running functional tests"
APP=Products/app/matinntak.app                                 \
   DEVICE_TARGET="iPad 2 (9.3)"                                \
   bundle exec cucumber ../features -r ../features/support/ios \
   -r ../features/step_definitions                             \
   --format junit --out ../ci/calabash.xml                     \
   --format usage                                           \
    || { failTests; }
success


TESTS = $(wildcard test/**)
SRC = $(wildcard index.js lib/**)

default: build

build: build/build.js

build/build.js: $(SRC) $(TESTS)
	@-mkdir build
	@duo --root . test/tests.js > $@

test: build/build.js
	@duo test -R dot phantomjs -B build/build.js

mocha: build/build.js
	@duo test browser -B build/build.js -c make

watch:
	watch make build > /dev/null

clean:
	rm -rf build components

.PHONY: test mocha clean watch

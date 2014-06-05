
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

dist: components dist-build dist-minify

dist-build:
	@component build -s wordAtCursor -o dist -n wordAtCursor

dist-minify: dist/wordAtCursor.js
	@curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@$<" \
		http://closure-compiler.appspot.com/compile \
		> $<.tmp
	@mv $<.tmp dist/wordAtCursor.min.js

clean:
	rm -fr build components template.js

test: build
	@./node_modules/.bin/component-test browser


.PHONY: clean test

---
title: "WebMock: RSpec Matchers Don't Work in Headers"
lang: en
published: 2026-02-24
gist_url: "https://gist.github.com/otariidae/29a0faa10df1f8c80857f4dcbc834f48"
---

Preferences for test doubles vary among developers, but if you lean toward using real implementations whenever possible, you likely rely heavily on WebMock to stub your HTTP interactions.

WebMock is an essential tool in such workflows. One of its most convenient features is its compatibility with RSpec matchers, such as `anything` or `a_string_starting_with`, within the `.with` method.

## The Problem

Consider the following examples. While matching the request body works as expected, the same logic fails when applied to headers:

```ruby
# This works fine
stub_request(:post, "www.example.com").with(body: { id: anything })
```

```ruby
# This fails!
stub_request(:post, "www.example.com").with(headers: { Authorization: a_string_starting_with("Bearer") })
```

In the second example, you will get a `WebMock::NetConnectNotAllowedError` because the stub fails to match the actual request.

## Under the hood

By digging into the WebMock source code, I found that the treatment of headers and bodies is fundamentally different.

Specifically, in the `WebMock::Util::Headers.normalize_headers` method, header values are forcibly stringified using `to_s` before they are registered.

https://github.com/bblimke/webmock/blob/596d8a8949c2e01113217263333a08507d2881eb/lib/webmock/util/headers.rb#L13-L24

Since RSpec matchers are Ruby objects, calling to_s on them returns their internal string representation (e.g., `"#<RSpec::Matchers::BuiltIn::Anything...>"`). As a result, WebMock tries to match the literal string of the matcher object against the actual header value, which never matches.

## Solutions

Use Regular Expressions (Regexp) or a Proc If you need flexible header matching.

```ruby
# Solution 1: Using Regexp
stub_request(:any, "www.example.com")
  .with(headers: { 'Authorization' => /^Bearer .*/ })

# Solution 2: Using a Proc for more complex logic
stub_request(:any, "www.example.com")
 .with { |request| request.headers['Authorization'].start_with?('Bearer') }
```

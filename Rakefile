version = '0.0.1'

desc 'run all the tests'
task :test do
  system "node test/runner.js"
end

desc 'tag and publish a new release'
task :publish do
  system "git tag -a -m \"Version #{version}\" v#{version} && git push --tags && npm publish"
end

task :default => :test
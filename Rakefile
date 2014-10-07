require 'rake'

task :default => :test

task :build do
  system('jekyll build')
end

task :test => :build do
  status = system('htmlproof ./_site')
  exit status
end

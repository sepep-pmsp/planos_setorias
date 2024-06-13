source "https://rubygems.org"

# Gem padrão para o Jekyll
gem "jekyll", "~> 4.3.3"

# Tema padrão para novos sites Jekyll
gem "jekyll-theme-quartz"

# Se você deseja usar o GitHub Pages, descomente a linha abaixo e comente a linha `gem "jekyll"`
#gem "github-pages", group: :jekyll_plugins


# Gems para plugins do Jekyll
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# Gems para plataformas específicas
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Booster de desempenho para assistir diretórios no Windows
gem "wdm", "~> 0.1.1", platforms: [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]

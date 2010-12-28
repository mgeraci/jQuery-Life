set :application, "jQuery-Life"
set :repository,  "git@github.com:mgeraci/jQuery-Life.git"

set :scm, :git

set :user, "mglife"  # The server's user for deploys
set :scm_passphrase, ",FNbmtfQ/g6hJL%G8y+QQcBgC"  # The deploy user's password
set :branch, "master"

ssh_options[:forward_agent] = true

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
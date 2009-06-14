# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_resources_session',
  :secret      => '7c62abe537d5a8de88f86c5a136a1d113665be82acc70909430786966d4bf89c1192482d7c4ec274b3699ecf8a2acaf05d130e166e17418846312a25f17f54b9'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

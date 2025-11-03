/*
  # Setup Admin Function

  1. Functions
    - `set_user_as_admin` - Function to promote a user to admin status
    
  2. Notes
    - After creating your admin user (admin@vlstore.com) through signup,
      you can run: SELECT set_user_as_admin('admin@vlstore.com');
    - This function is SECURITY DEFINER so it can be called by any authenticated user
    - In production, you should restrict this function to superusers only
*/

CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET is_admin = true
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

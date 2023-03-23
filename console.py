#!/usr/bin/env python3
"""Define the Pepper Console, an interface to interact with the Pepper API
"""
import cmd
import requests
import signal
import os
import base64

PORT = os.environ.get("PORT") or 5000
API = os.environ.get("API") or f"http://localhost:{PORT}/api/v1"
class Pepper(cmd.Cmd):
    """Pepper Console"""
    prompt = 'pepper> '
    intro = 'Welcome to the Pepper Console. Type help or? to list commands.\n Use the cmd Ctrl + D or type quit to quit thr program'

    def __init__(self):
        """Initialize the class"""
        super().__init__()
        self._token = None

    def cmdloop(self, intro=None):
        # Register signal handler for SIGINT
        signal.signal(signal.SIGINT, self.handle_sigint)
        return super().cmdloop(intro)

    def handle_sigint(self, signum, frame):
        # Handle SIGINT signal (Ctrl+C)
        print("Caught Ctrl+C, quitting...")
        raise SystemExit

    def emptyline(self):
        """Ignore empty spaces."""
        pass

    def do_quit(self, line):
        """Quit command to exit the program."""
        return True

    def do_exit(self, line):
        """Exit command to exit the program."""
        return True

    def do_EOF(self, line):
        """EOF signal to exit the program."""
        print("")
        return True
    
    def do_health(self, line):
        """Command to check the health of the API systems."""
        try:
            response = requests.get(f'{API}/status')
            if response.status_code == 200:
                print("Pepper is healthy")
            else:
                print("Pepper is not healthy")
        except Exception as e:
            print(e)
    
    def do_login(self, line):
        """Command to sign in a user
        Usage: login <username> <password>
        """
        try:
            username = line.split(' ')[0]
            password = line.split(' ')[1]
            basicToken = base64.b64encode(f'{username}:{password}'.encode('utf-8')).decode('utf-8')
            response = requests.post(f'{API}/login', headers={'Authorization': f'Basic {basicToken}'})
            if response.status_code == 200:
                print(f"Successfully logged in as {username}!")
                self._token = response.cookies.get('token')
            else:
                print("Failed to login :(")
        except Exception as e:
            print(e)
    
    def do_logout(self, line):
        """Command to logout a user
        Usage: logout
        """
        try:
            response = requests.post(f'{API}/logout', cookies={'token': self._token})
            if response.status_code == 200:
                print("Successfully logged out!")
                self._token = None
            else:
                print("Failed to logout :(", response)
        except Exception as e:
            print(e)
    
    def do_create_user(self, line):
        """Command to create a user
        Usage: create_user <username> <password>
        """
        try:
            username = line.split(' ')[0]
            password = line.split(' ')[1]
            response = requests.post(f'{API}/users', json={'username': username, 'password': password})
            if response.status_code == 201:
                print(f"Successfully created user {username}!")
            else:
                print("Failed to create user :(")
        except Exception as e:
            print(e)
    
    def do_delete_user(self, line):
        """Command to delete a user
        Usage: delete_user <username>
        """
        try:
            username = line.split(' ')[0]
            response = requests.delete(f'{API}/users/{username}', cookies={'token': self._token})
            if response.status_code == 200:
                print(f"Successfully deleted user {username}!")
            else:
                print("Failed to delete user :(")
        except Exception as e:
            print(e)
    
    def do_create_role(self, line):
        """Command to create a role
        Usage: create_role <role_name>
        """
        try:
            role_name = line.split(' ')[0]
            response = requests.post(f'{API}/roles', json={'name': role_name}, cookies={'token': self._token})
            if response.status_code == 201:
                print(f"Successfully created role {role_name}!")
            else:
                print("Failed to create role :(")
        except Exception as e:
            print(e)

    def do_get_roles(self, line):
        """Command to get all roles
        Usage: get_roles
        """
        try:
            response = requests.get(f'{API}/roles', cookies={'token': self._token})
            if response.status_code == 200:
                print(f"Successfully retrieved roles!")
                print(response.json())
            else:
                print("Failed to retrieve roles :(")
        except Exception as e:
            print(e)

    def do_get_role(self, line):
        """Command to get a role
        Usage: get_role <role_id>
        """
        try:
            role_name = line.split(' ')[0]
            response = requests.get(f'{API}/roles/{role_name}', cookies={'token': self._token})
            if response.status_code == 200:
                print(f"Successfully retrieved role {role_name}!")
                print(response.json())
            else:
                print("Failed to retrieve role :(")
        except Exception as e:
            print(e)
    
    def do_delete_role(self, line):
        """Command to delete a role
        Usage: delete_role <role_id>
        """
        try:
            role_name = line.split(' ')[0]
            response = requests.delete(f'{API}/roles/{role_name}', cookies={'token': self._token})
            if response.status_code == 200:
                print(f"Successfully deleted role {role_name}!")
            else:
                print("Failed to delete role :(")
        except Exception as e:
            print(e)

    def do_update_role(self, line):
        """Command to update a role
        Usage: update_role <role_id> <role_name>
        """
        try:
            role_id = line.split(' ')[0]
            role_name = line.split(' ')[1]
            response = requests.put(f'{API}/roles/{role_id}', cookies={'token': self._token}, json={'name': role_name})
            if response.status_code == 200:
                print(f"Successfully updated role {role_id}")
                print(response.json())
            else:
                print("Failed to update role")
        except Exception as e:
            print(e)
    
    def do_get_permissions(self, line):
        """Get all available permissions
        Usage: get_permissions
        """
        try:
            response = requests.get(f'{API}/permissions', cookies={'token': self._token})
            if response.status_code == 200:
                print(response.json())
            else:
                print("Failed to retrieve permissions")
        except Exception as e:
            print(e)

    def do_get_role_permissions(self, line):
        """Get all available permissions for a role
        Usage: get_role_permissions <role_id>
        """
        try:
            role_id = line.split(' ')[0]
            response = requests.get(f'{API}/roles/{role_id}/permissions', cookies={'token': self._token})
            if response.status_code == 200:
                print(response.json())
            else:
                print("Failed to retrieve permissions")
        except Exception as e:
            print(e)
    
    def do_add_permission_to_role(self, line):
        """Add permission to a role
        Usage: add_permission_to_role <role_id> <permission_id>
        """
        try:
            role_id = line.split(' ')[0]
            permission_id = line.split(' ')[1]
            response = requests.post(f'{API}/roles/{role_id}/add-permission?permissionID={permission_id}', cookies={'token': self._token})
            if response.status_code == 200:
                print(response.json())
            elif response.status_code == 400:
                print("Role already has permission")
            else:
                print("Failed to add permission to role")
        except Exception as e:
            print(e)
    
    def do_remove_permission_from_role(self, line):
        """Remove permission from a role
        Usage: remove_permission_from_role <role_id> <permission_id>
        """
        try:
            role_id = line.split(' ')[0]
            permission_id = line.split(' ')[1]
            response = requests.delete(f'{API}/roles/{role_id}/remove-permission?permissionID={permission_id}', cookies={'token': self._token})
            if response.status_code == 200:
                print(response.json())
            else:
                print("Failed to remove permission from role", response)
        except Exception as e:
            print(e)

if __name__ == '__main__':
    Pepper().cmdloop()

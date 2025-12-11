#!/bin/bash
# Script to setup SSH key on server
# Run this on your server (36.50.176.92)

# Create .ssh directory if not exists
mkdir -p ~/.ssh

# Add your public key (replace with your actual public key)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG8ojYUEY2GZOPlB0F6dJ8Ui/4MGacORv0TYBBCpCR+D nguyen phuc@Admin" >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Restart SSH service (if needed)
sudo systemctl restart sshd

echo "SSH key setup completed!"
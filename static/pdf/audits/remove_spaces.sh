#!/bin/bash

# Loop through all files in the current directory
for oldname in *
do
  # Replace spaces with empty string
  newname=$(echo "$oldname" | tr -d ' ')
  
  # Check if newname is different from oldname
  if [ "$oldname" != "$newname" ]; then
    mv "$oldname" "$newname"
    echo "Renamed: $oldname -> $newname"
  fi
done
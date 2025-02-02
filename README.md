# greenclean

A utility to clean up an image folder based on selected JPG files with Green tag.

It will take a single command line argument which is to contain a path to a valid folder on Mac. When I run the script it will scan the folder, find the JPG files with Green tag, and put them in a list. If the program does not find any files with Green tag it should abort. If the list is not empty it should list the files and prompt "Do you want to proceed and clean up non-Green files? (y/n)". If the user enters 'y' it should delete all DNG and JPG files with names different than the ones in the Green list. The idea is to delete all files that are not Green. If the user enters 'n' the program should abort.

For example: consider a folder with the following files:

```bash
1.JPG, 1.DNG, 2.JPG, 2.DNG, 3.JPG, 3.DNG, 4.JPG, 4.DNG, 5.JPG, 5.DNG
```

Assume the files 3.JPG and 5.JPG have Green tags. When the script runs the following should be  the list of files remaining in the folder:

```bash
3.JPG, 3.DNG, 5.JPG, 5.DNG
```

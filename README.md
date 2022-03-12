# :warning: Hey you! :warning:

This repo contains a new and ongoing project. Currently, this repo works and installs correctly on the 3 systems I tested this on, but there are more features and polishing to be done. With that being said, enjoy!

# `lset`: The **L**inux **S**treamer's **E**ssential **T**oolkit

Ever wanted to stream on Linux and *really* don't want to mess with any yucky online services to make your stream worthwhile? Well now you can, using your own self hosted tools!

Here you can find two separate programs: a Node.JS Twitch bot and a Python script for a follower/sub goal. Both of these scripts stem off the scripts I made for my streams, just heavily altered so they can be configured using JSON files. In order to set it up, read the [installing](#installing) section of this README, or you can view the documents for both the [Twitch bot]() and the [Python script]() to set them up separately.

## Installing

Two things are assumed with these tools:
1. Basic understanding of navigating a Unix shell
1. Basic understanding of JSON and editing JSON files

You have three options to install these tools:
1. Run the `install.sh` file to install the dependencies, and take the automated setup process where you are guided to each file that you need to configure to set up the scripts properly.
1. Run the `install.sh` file to install the dependencies, and exit the automated setup to configure the corresponding scripts' JSON files yourself.
1. Figure it out yourself if you know what you're doing.

Before you continue, make sure you have the following tools installed:
```
git
npm
node
python3
pip3
```

You can install these with the following commands in these distros:
### Ubuntu/Debian
```bash
$ sudo apt install git npm nodejs python3 python3-pip
```
### Fedora/CentOS/Other RHEL
```bash
# if 'yum' is not found, you should try 'dnf'
$ sudo yum install git npm nodejs python3 python3-pip
```
### Arch/Manjaro
```bash
$ sudo pacman -S git npm nodejs python3 python-pip
```
### openSUSE
```bash
$ sudo zypper install git npm16 nodejs16 python3 python3-pip
```
### Other Distros/BSD
If you fit this description, you probably know what you're doing.


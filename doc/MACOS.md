# macOS Installation

To install `lset` on macOS, you need to make sure that you have the Command Line Tools installed. The easiest way to make sure they are downloaded is to open the Terminal app and run:
```bash
% git
```
If you have the tools installed, `git` will display a help message. If you don't, a window should appear asking if you would like to install them. 

You will also need to install Node.js and npm, both of which can be installed through one package found on the downloads section of the [Node.js Website](https://nodejs.org/en/download/). 

Once you have both items installed, you will be able to run the same files (`install.sh` and `run.sh`) as you would on Linux:
```
# note: if you use './install.sh' or './run.sh', the read command may not work properly
$ sh install.sh
$ sh run.sh
```

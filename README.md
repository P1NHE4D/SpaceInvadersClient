# SpaceInvaders
The space invaders application consists of a client and a [server](https://github.com/P1NHE4D/SpaceInvadersServer). The client is based on Angular and handles the actual gameplay, whereas the server uses ASP.NET CORE and an SQLite database to store the scores achieved by the players.
Hence, both the client and server have to be installed for the application to work.

After downloading the git repositories and installing the required packages, please refer to the [Execution](#execution) section.

## Table of Contents
1. [Client Installation Guide](#spaceinvadersclient)
2. [Server Installation Guide](#spaceinvadersserver)
3. [Executing the Application](#execution)

# SpaceInvadersClient

## Installation

### 1. Install node.js
Angular 8 requires node.js 10.9 or greater

#### Windows
Download and install node.js from the [official website](https://nodejs.org/en/#home-downloadhead).

#### Ubuntu
```bash
# if required, install curl
sudo apt-get install -y curl

# install nodejs version >= 10.9
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install npm Package Manager
#### Windows
The npm package manager will be installed automatically with the download of the node.js executable described in [step 1](#1-install-nodejs). You can verify that it is installed on your computer by executing `npm -v` in a cmd window.

#### Ubuntu
`sudo apt-get install -y npm`

### 3. Install Angular

#### Windows
Execute the following commands in a cmd window:
```bat
npm install -y -g @angular/cli
```

#### Ubuntu
`sudo npm install -y -g @angular/cli`

### 4. Install Project Dependencies
Make sure you are in the main directory of the SpaceInvadersClient project or provide the path to the package.json file located in the project folder to the `npm install` command as an argument.

#### Windows
```bat
# The following command will install every package listed in the package.json file
npm install
```

#### Ubuntu
```bash
# The following command will install every package listed in the package.json file
sudo npm install
```

# SpaceInvadersServer
The git repository of the server can be found [here](https://github.com/P1NHE4D/SpaceInvadersServer).
It is based on C# and requires .NET Core SDK version 2.2.

## Installation

#### Windows
Download and execute the .NET Core 2.2 SDK installer from the [official website](https://dotnet.microsoft.com/download/dotnet-core/2.2).

#### Ubuntu
```bash
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb

sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get install dotnet-sdk-2.2
```

The documentation for installing dotnet on a system running a different os can be found [here](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current).

# Execution
Since this application uses HTML5, it is strongly recommended to use the latest version of the Firefox, Chrome or Safari browser for the application to function properly. 

## Launch Server and Client Application

#### Windows
Navigate to the folder containing the server application and execute the following command in a cmd window:
```bat
# Launch the server
dotnet run SpaceInvadersServer.csproj
```

Navigate to the folder containing the client application and execute the following command in a cmd window:
```bat
# Launch the client application
ng serve
```

#### Ubuntu
Navigate to the folder containing the files for the server. Execute the following command in a separate terminal window:
```bash
# Launch the server
dotnet run SpaceInvadersServer.csproj
```

Navigate to the folder containing the client application. Execute the following command in a terminal:
```bash
# Launch the client application
ng serve
```

## Open Application in Browser
With both the server and the client up and running, navigate to https://localhost:4200 to play the game. Enjoy!

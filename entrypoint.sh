#!/bin/sh

export CONNECTION_STRING=MySqlConnectionString

dotnet LoadTestingApp.Blazor.Server.dll --updateDatabase --forceUpdate --silent

dotnet LoadTestingApp.Blazor.Server.dll
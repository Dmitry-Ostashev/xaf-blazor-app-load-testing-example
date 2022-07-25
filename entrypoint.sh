#!/bin/sh

dotnet LoadTestingApp.Blazor.Server.dll --updateDatabase --forceUpdate --silent

dotnet LoadTestingApp.Blazor.Server.dll
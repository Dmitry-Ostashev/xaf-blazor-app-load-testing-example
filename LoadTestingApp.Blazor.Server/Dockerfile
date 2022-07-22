#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["LoadTestingApp.Blazor.Server/LoadTestingApp.Blazor.Server.csproj", "LoadTestingApp.Blazor.Server/"]
COPY ["LoadTestingApp.Module/LoadTestingApp.Module.csproj", "LoadTestingApp.Module/"]
RUN dotnet restore "LoadTestingApp.Blazor.Server/LoadTestingApp.Blazor.Server.csproj"
COPY . .
WORKDIR "/src/LoadTestingApp.Blazor.Server"
RUN dotnet build "LoadTestingApp.Blazor.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LoadTestingApp.Blazor.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LoadTestingApp.Blazor.Server.dll"]
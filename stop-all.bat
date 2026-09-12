@echo off
title EkSutra - Stop All Servers
powershell -ExecutionPolicy Bypass -File "%~dp0stop-all.ps1"
pause

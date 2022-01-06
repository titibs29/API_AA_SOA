local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'

local store = {}

return store
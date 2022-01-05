--executer avec ctrl+shift+b ou via terminal > executer la tache > run lua
--#region appel à la librairie socket locale
package.path = package.path..';./.client/libs/lua/?.lua'
package.cpath = package.cpath..';./.client/libs/socket/?.dll;./libs/mime/?.dll'

local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'
--#endregion


local url = 'http://localhost:3000' --url a appeler


function connect(url)
    local body, statuscode, headers, statustext = http.request(url)
    return statuscode
end

function createAccount(url, name, password)
    urlString = url.."/acc/signin"
    local req = json.encode({name = name, password = password})
    local res = {}
    local result, statuscode, headers, statustext = http.request {
        method = "POST",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    body = table.concat(res)
    print('resultats de la creation:')
    print('body '..tostring(body))
    return statuscode
end



--[[ début de la zone de test ]]
local lu = require('luaunit')

TestAccount = {}

    function TestAccount:setUp()
        local clientId = 0
    end

    function TestAccount:test1()
        result = connect(url)
        lu.assertEquals(result, 403)
    end

    function TestAccount:test2()
        result = createAccount(url, "luacreate", "luapassword" )
        lu.assertEquals( result, 201)
    end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )
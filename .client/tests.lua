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
    local urlString = url.."/acc/signin"
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

    body = json.decode(table.concat(res))
    local clientId = 'nil'

    if statuscode == 201 then
        clientId = body.message
    end
  
    return statuscode, clientId
end

function modifyAccount()

end

function deleteAccount(url, id)
    if id == 'nil' then
        error('client ID undefined')
    else 

    local urlString = url.."/acc/"..id
    local req = ""
    local res = {}

    local result, statuscode, headers, statustext = http.request {
        method = "DELETE",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    return statuscode

    end
end



--[[ début de la zone de test ]]
local lu = require('luaunit')

TestAccount = {}

    function TestAccount:setUp()
        local clientId = 'nil'
    end

    function TestAccount:test1()
        result = connect(url)
        lu.assertEquals(result, 403)
    end

    function TestAccount:test2()
        result, clientId = createAccount(url, "luacreate", "luapassword" )
        print(clientId)
        lu.assertEquals( result, 201)
    end

    function TestAccount:test3()
        result, clientId = deleteAccount(url, clientId)
        lu.assertEquals( result, 200)
    end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )
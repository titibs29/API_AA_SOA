--executer avec ctrl+shift+b ou via terminal > executer la tache > run lua
--#region appel à la librairie socket locale
package.path = package.path..';./client_lua/libs/lua/?.lua'
package.cpath = package.cpath..';./client_lua/libs/socket/?.dll;./libs/mime/?.dll'

local http=require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local luaunit = require 'luaunit'
--#endregion

function connectTest(url)
    local body, statuscode, headers, statustext = http.request(url)
    if(statuscode == 200 or statuscode == 201 ) then
    return 0
    else
    return statuscode
    end
end

function createAccount(urlString, username, userfirstname, password, age, role)
    --[[if(type(age) == numbers)then
        return " age is not a number"
    end
    if(type(role) == numbers)then
        return " role is not a number"
    end
    if(role >2 or role < 0)then
        return "role is not between 0 and 2"
    end]]
    local req =[[{"username": "]]..username..[[","userfirstname": "]]..userfirstname..[[","password": "]]..password..[[","age": ]]..age..[[}]]
    local res = {}
    print("sending ")
    print(req)
    local body, statuscode, headers, statustext = http.request {
        url = urlString.."/users/customers/inscription",
        method = "POST",
        source = ltn12.source.string(req),
        sink = ltn12.sink.table(res)
    }
    
    return res
end

local url = 'http://localhost:3000' --url a appeler


--[[ code de base
print('trying to connect to ', url) --output de l'url
local body, statusCode, headers, statusText = http.request(url)
print('statusCode ', statusCode) --code de status
print('statusText ', statusText) --message du status correspondant
print('headers ')
if (headers) then
for index,value in pairs(headers) do
    print("\t",index, value)
end
end
print('body\n',body)
--]]


local result = connectTest(url)
print("tested ", url)
if(result == 0) then
    print("test check")
else
    print("test failed, code: ",result)
end

local result = createAccount(url, "thibo", "thibaut", "monMotDePasse", 18, 2 )
print("trying to create an account on ", url)
print('recieved')
print(tostring(result))

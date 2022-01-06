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


-- connexion
function connect(url)
    local body, statuscode, headers, statustext = http.request(url)
    return statuscode
end


    -- creer un compte
    function acc_create(url, name, password)
        local urlString = url.."/acc/signin"
        local req = json.encode({name = name, password = password})
        local res = {}
        local clientId = 'nil'

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

        if statuscode == 201 then
            clientId = body.userId
        end
  
        return statuscode, clientId
    end

    -- login
    function acc_login(url, name, password)
        local urlString = url.."/acc/login"
        local req = json.encode({name = name, password = password})
        local res = {}
        local userId = 'nil'
        local token = 'nil'

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

        if statuscode == 200 then
            body = json.decode(table.concat(res))
            userId = body.userId
            token = body.token

        end


        return statuscode, userId, token


    end

    --afficher un compte
    function acc_showOne(url, tokenSess, idToShow)
        local urlString = url.."/acc/"..idToShow

        local req = json.encode({token = tokenSess})
        local res = {}
        local name = ''

        local result, statuscode, headers, statustext = http.request {
            method = "GET",
            url = urlString,
            source = ltn12.source.string(req),
            headers={
                ["content-type"] = "application/json; charset=utf-8",
                ["content-length"] = tostring(#req)
            },
            sink = ltn12.sink.table(res)
        }

        if statuscode == 200 then
        body = json.decode(table.concat(res))
        name = body.name
        end

        return statuscode, name
    end

    --afficher tout les comptes
    function acc_showAll()
        
    end

    -- modifier un compte
    function acc_modify()

    end

    -- supprimer le compte
    function acc_del(url, idToDel, tokenSess, idSess)
        if idToDel == 'nil' then
            error('id du compte à supprimer non fournie')

        elseif tokenSess == 'nil' then
            error('token null')

        elseif idSess == 'nil' then
            error('id du compte actif non fournie')
        else

        local urlString = url.."/acc/"..idToDel
        local req = json.encode({token = tokenSess, userId = idSess})
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

Begin = {}

    -- simple test de connexion
    function Begin:test1()
        result = connect(url)
        lu.assertEquals(result, 403)
    end

TestAccount = {}

    function TestAccount:setUp()
        local actualId = 'nil'
        local clientId1 = 'nil'
        local clientId2 = 'nil'
        local adminId = 'nil'
        local tokenSess1 = 'nil'
        local tokenSess2 = 'nil'
        local tokenSessAdmin = 'nil'
    end

    -- création d'un compte client
    function TestAccount:test1a()
        one, clientId1 = acc_create(url, "luacreate", "luapassword" )
        lu.skipIf(one == 400, "le compte existe")
        lu.assertEquals( one, 201)
        
    end
    -- création d'un secon compte client
    function TestAccount:test1b()
        two, clientId2 = acc_create(url, "luasecond", "secondpass")
        lu.skipIf(two == 400, "le compte existe")
        lu.assertEquals( two, 201)
        
    end

    -- creation de 3 sessions dont une admin
    function TestAccount:test2()
        one, adminId, tokenSessAdmin = acc_login(url, "admin", "admin" )
        two, clientId1, tokenSess1 = acc_login(url, "luacreate", "luapassword" )
        tree, clientId2, tokenSess2 = acc_login(url, "luasecond", "secondpass" )
        lu.assertEquals( one, 200)
        lu.assertEquals( two, 200)
        lu.assertEquals( tree, 200)
    end

    -- test de suppression d'un compte client par un autre client (403 attendu)
    function TestAccount:test3()
        
        one = acc_del(url, clientId2, tokenSess1, clientId1)
        lu.assertEquals(one, 403)
        
        
    end

    -- récupère le nom de l'utilisateur
    function TestAccount:test4()

        one, name = acc_showOne(url, tokenSess1, clientId1)
        lu.assertEquals(one, 200)
        lu.assertEquals(name, "luacreate")
        
    end

    -- suppression des deux comptes clients créés
    function TestAccount:test9a()

        one= acc_del(url, clientId1, tokenSess1, clientId1) -- suppression par proprio
        lu.assertEquals(one, 200)
    end

    function TestAccount:test9b()

        two= acc_del(url, clientId2, tokenSessAdmin, adminId) --suppression par admin
        lu.assertEquals(two, 200)
    end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )
--executer avec ctrl+shift+b ou via terminal > executer la tache > run lua
--#region appel à la librairie socket locale
package.path = package.path..';./.client/libs/lua/?.lua;./.client/?.lua'
package.cpath = package.cpath..';./.client/libs/socket/?.dll;./libs/mime/?.dll'

local http = require 'socket.http'
local acc = require 'acc'
local store = require 'store'
local pi = require 'pi'
local booking = require 'booking'
--#endregion


local url = 'http://localhost:3000' --url a appeler

local clientId1 = nil;
local clientId2 = nil;
local adminId = nil;
local tokenSess1 = nil;
local tokenSess2 = nil;
local tokenSessAdmin = nil;

local articleId = nil;

local piid = nil;

-- connexion
function connect(url)
    local body, statuscode, headers, statustext = http.request(url)
    return statuscode
end




--[[ début de la zone de test ]]
local lu = require('luaunit')

TestBegin = {}

    function TestBegin:setup()
    end

    -- simple test de connexion
    function TestBegin:test1()
        local status = nil;
        status = connect(url);
        lu.assertEquals(status, 404);
    end

    -- connexion sur une mauvaise adresse....
    function TestBegin:test2()
        local status = nil;
        status = connect(url..'/teapot');
        lu.assertEquals(status, 418);
    end

    -- redirection vers le site web
    function TestBegin:test3()
        local status = nil;
        status = connect(url..'/web');
        lu.assertEquals(status, 308);
    end



--#region account
TestAccount = {}

    function TestAccount:setUp()
    end


    -- création de compte
    function TestAccount:test1a() -- premier compte
        local status = nil;
        status, clientId1 = acc.create(url, "luacreate", "luapassword" );
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
    end
    function TestAccount:test1b() -- second compte
        local status = nil;
        status, clientId2 = acc.create(url, "luasecond", "secondpass");
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
        
    end


    -- creation de 3 sessions
    function TestAccount:test2a() -- session admin
        local status = nil;
        status, adminId, tokenSessAdmin = acc.login(url, "admin", "admin" );
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2b() -- session client 1
        local status = nil;
        status, clientId1, tokenSess1 = acc.login(url, "luacreate", "luapassword" );
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2c() -- session client 2
        local status = nil;
        status, clientId2, tokenSess2 = acc.login(url, "luasecond", "secondpass" );
        lu.assertEquals( status, 200);
    end


    -- affiche l'utilisateur
    function TestAccount:test3a() -- par son proprio
        local status = nil;
        local name = nil;
        status, name = acc.showOne(url, tokenSess1, clientId1);
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end
    function TestAccount:test3b() -- par un autre client
        local status = nil;
        local name = nil;
        status, name = acc.showOne(url, tokenSess2, clientId1);
        lu.assertEquals(status, 403);
        lu.assertEquals(name, nil);
        
    end
    function TestAccount:test3c() -- par un admin
        local status = nil;
        local name = nil;
        status, name = acc.showOne(url, tokenSessAdmin, clientId1);
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end

    -- modification d'un compte
    function TestAccount:test4a() -- par son proprio
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        local role = 3;
        status = acc.modify(url,tokenSess1, clientId1, "newname", "newPass",1);
        statusTwo, name, role = acc.showOne(url, tokenSess1, clientId1) -- on verifie
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newname");
        lu.assertEquals(role, 2); -- hors role
    end
    function TestAccount:test4b() -- par un autre client
        local status = 0;
        status = acc.modify(url,tokenSess1, clientId2, "newname", "newPass",1);
        lu.assertEquals(status, 403);
    end
    function TestAccount:test4c() -- par un admin
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        local role = 3;
        status = acc.modify(url,tokenSessAdmin, clientId1, "newnametwo", "newPasstwo",1);
        statusTwo, name, role = acc.showOne(url, tokenSess1, clientId1)
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newnametwo");
        lu.assertEquals(role, 1); -- !! client 1 devient artisan
    end
    


    -- affichage de toute la base
    function TestAccount:test5a() -- avec un compte client
        local status = 0;
        status = acc.showAll(url, tokenSess1);
        lu.assertEquals(status, 403);
    end
    function TestAccount:test5b() -- avec un compte admin
        local status = 0;
        status = acc.showAll(url, tokenSessAdmin);
        lu.assertEquals(status, 200);
    end

--#endregion

--#region articles
TestStore = {}

    function TestStore:setup()

    end

    -- affiche tout le store
    function TestStore:test1()
        local status = 0;
        status = store.showAll(url)
        lu.assertEquals(status, 200)
    end

    -- creer un article
    function TestStore:test2a() -- par un client
        local status = 0;
        local badArticleId = nil;
        status, badArticleId = store.create(
            url,
            tokenSess1,
            "artByClient",
            "cet article ne va pas se creer",
            5.25
        )
        lu.assertEquals(status, 403)
        lu.assertEquals(badArticleId, nil)
    end
    function TestStore:test2b() -- par un admin
        local status = 0;
        local thisArticleId = nil;
        status, thisArticleId = store.create(
            url,
            tokenSessAdmin,
            "articleValide",
            "cet article est un article de test",
            10.99
        )
        articleId = thisArticleId
        lu.skipIf(status == 400, "l'article existe déjà")
        lu.assertEquals(status, 201)
    end
    function TestStore:test2c() -- pas de doublon
        local status = 0;
        status, articleId = store.create(
            url,
            tokenSessAdmin,
            "articleValide",
            "cet article exite déjà",
            8.99
        )
        lu.assertEquals(status, 400)
    end

    -- afficher un article
    function TestStore:test3a() -- par un client
        local status = nil;
        local name = nil;
        local prix = nil;
        status, name, prix = store.showOne(url, tokenSess1, articleId)
        lu.assertEquals(status, 403)
        lu.assertEquals(name, nil)
        lu.assertEquals(prix, nil)
    end
    function TestStore:test3b() -- par un admin
        local status = nil;
        local name = nil;
        local prix = nil;
        status, name, prix = store.showOne(url, tokenSessAdmin, articleId)

        lu.assertEquals(status, 200)
        lu.assertEquals(name, "articleValide")
        lu.assertEquals(prix, 10.99)
    end
    function TestStore:test3c() -- un article qui n'existe pas
        local status = nil;
        local name = nil;
        local prix = nil;
        status, name, prix = store.showOne(url, tokenSessAdmin, '61d6da87fa9a919f15fa4e1d')

        lu.assertEquals(status, 404)
        lu.assertEquals(name, nil)
        lu.assertEquals(prix, nil)
    end
    function TestStore:test3d() -- un article qui n'existe pas
        local status = nil;
        local name = nil;
        local prix = nil;
        status, name, prix = store.showOne(url, tokenSessAdmin, 'veryBadId')

        lu.assertEquals(status, 400)
        lu.assertEquals(name, nil)
        lu.assertEquals(prix, nil)
    end


    -- modifier un article
    function TestStore:test4a() -- par un client
        local status = nil;
        status = store.modify(url,tokenSess1,articleId,"nouvelArticle")
        lu.assertEquals(status, 403)
    end
    function TestStore:test4b() -- par un admin
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        status = store.modify(url,tokenSessAdmin,articleId,"nouvelArticle")
        statusTwo, name = store.showOne(url, tokenSessAdmin, articleId)
        
        lu.assertEquals(status, 200)
        lu.assertEquals(statusTwo, 200)
        lu.assertEquals(name, "nouvelArticle")
    end
    function TestStore:test4c() -- un mauvais article
        local status = nil;
        status = store.modify(url,tokenSessAdmin,'badArticleId',"nouvelArticle")
        lu.assertEquals(status, 400)
    end


    -- supprimer un article
    function TestStore:test5a() -- par un client
        local status = 0;
        status = store.del(url, tokenSess1, articleId)
        lu.assertEquals(status, 403)
    end
    function TestStore:test5b() -- par un admin
        local status = 0;
        status = store.del(url, tokenSessAdmin, articleId)
        lu.assertEquals(status, 200)
    end
    function TestStore:test5c() -- déjà supprimé
        local status = 0;
        status = store.del(url, tokenSessAdmin, articleId)
        lu.assertEquals(status, 404)
    end

--#endregion

--#region points d'intérêts
TestPi = {}

    function TestPi:setup()

    end

    -- rappel : client 1 est artisan
    -- creer un pi
    function TestPi:test1a() -- par un client
        local status = nil;
        status = pi.create(url,tokenSess2,"premier nom", 35.5, 40.2, "une description simple", "a simple description", "url de la vidéo")
        lu.assertEquals(status, 403)
    end
    function TestPi:test1b() -- par un admin
        local status = nil;
        status, piid = pi.create(url,tokenSessAdmin,"premier nom", 35.5, 40.2, "une description simple", "a simple description", "url de la vidéo")
        lu.skipIf(status == 400, "pi existant")
        lu.assertEquals(status, 201)
    end

    -- afficher un pi
    function TestPi:test2()
        local status = nil;
        local name = nil;
        local artisan = nil;
        local x = nil;
        local y = nil;
        local desc_fr = nil;
        local desc_en = nil;
        local video = nil;
        status, name, artisan, x, y, desc_fr, desc_en, video = pi.showOne(url, piid)
        lu.assertEquals(status, 200)
        lu.assertEquals(name, "premier nom")
        lu.assertEquals(artisan, nil)
        lu.assertEquals(x, 35.5)
        lu.assertEquals(y, 40.2)
        lu.assertEquals(desc_fr, "une description simple")
        lu.assertEquals(desc_en, "a simple description")
        lu.assertEquals(video, "url de la vidéo")
    end

    -- afficher tout les pi
    function TestPi:test3()
        local status = nil;
        status = pi.showAll(url)
        lu.assertEquals(status, 200)

    end

    -- modifier un pi
    function TestPi:test4a() -- client
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        local artisan = nil;
        local x = nil;
        local y = nil;
        local desc_fr = nil;
        local desc_en = nil;
        local video = nil;
        status = pi.modify(url,tokenSess2, piid,
                            "nouveau nom", 22.3, 20.0,
                            "une description un peu plus complexe",
                            "a more complex description",
                            "une nouvelle video", clientId1)
        statusTwo, name, artisan, x, y, desc_fr, desc_en, video = pi.showOne(url, piid)
        lu.assertEquals(status, 403)
        lu.assertEquals(statusTwo, 200)
        lu.assertEquals(name, "premier nom")
        lu.assertEquals(artisan, nil)
        lu.assertEquals(x, 35.5)
        lu.assertEquals(y, 40.2)
        lu.assertEquals(desc_fr, "une description simple")
        lu.assertEquals(desc_en, "a simple description")
        lu.assertEquals(video, "url de la vidéo")
    end
    function TestPi:test4b() -- admin
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        local artisan = nil;
        local x = nil;
        local y = nil;
        local desc_fr = nil;
        local desc_en = nil;
        local video = nil;
        status = pi.modify(url,tokenSessAdmin, piid,
                            "nouveau nom", 22.3, 20.0,
                            "une description un peu plus complexe",
                            "a more complex description",
                            "une nouvelle video", clientId1) -- definit l'artisan client 1 en propriétaire
        statusTwo, name, artisan, x, y, desc_fr, desc_en, video = pi.showOne(url, piid)
        lu.assertEquals(status, 200)
        lu.assertEquals(statusTwo, 200)
        lu.assertEquals(name, "nouveau nom")
        lu.assertEquals(artisan, clientId1)
        lu.assertEquals(x, 22.3)
        lu.assertEquals(y, 20.0)
        lu.assertEquals(desc_fr, "une description un peu plus complexe")
        lu.assertEquals(desc_en, "a more complex description")
        lu.assertEquals(video, "une nouvelle video")
    end
    function TestPi:test4c() -- artisan proprio
        local status = nil;
        local statusTwo = nil;
        local name = nil;
        local artisan = nil;
        local x = nil;
        local y = nil;
        local desc_fr = nil;
        local desc_en = nil;
        local video = nil;
        status = pi.modify(url,tokenSess1, piid,
                            "nom artisanal", 77.0, 3.5,
                            "une description artisanale",
                            "a very weird description",
                            "video artisanale")
        statusTwo, name, artisan, x, y, desc_fr, desc_en, video = pi.showOne(url, piid)
        lu.assertEquals(status, 200)
        lu.assertEquals(statusTwo, 200)
        lu.assertEquals(name, "nom artisanal")
        lu.assertEquals(artisan, clientId1)
        lu.assertEquals(x, 77.0)
        lu.assertEquals(y, 3.5)
        lu.assertEquals(desc_fr, "une description artisanale")
        lu.assertEquals(desc_en, "a very weird description")
        lu.assertEquals(video, "une nouvelle video")
    end

    --supprimer un pi
    function TestPi:test5a() -- client
        local status = nil;
        status = pi.del(url, tokenSess2, piid)
        lu.assertEquals(status, 403)
    end
    function TestPi:test5b() --admin
        local status = nil;
        status = pi.del(url, tokenSessAdmin, piid)
        lu.assertEquals(status, 200)
    end

--#endregion

--#region booking
TestBooking = {}

    function TestBooking:init()

    end

    -- creer une reservation
    function TestBooking:test1a() -- sans session
        local status = nil;
        status = booking.create(url,"BadToken","2012-12-21T12:12:00.000Z",adminId,clientId2)
        lu.assertEquals(status, 401)
    end
    function TestBooking:test1b() -- par un client
        local status = nil;
        status, bookId = booking.create(url,tokenSess2,"2018-05-04T13:30:00.000Z",clientId2,adminId)
        lu.skipIf(status == 400, "la reservation existe déjà")
        lu.assertEquals(status, 201)
    end

    -- afficher une réservation
    function TestBooking:test2a() -- par un client inconnu
        local status = nil;
        local date = nil;
        local participants = nil;

        status, date, participants = booking.showOne(url,tokenSess1, bookId)

        lu.assertEquals(status, 403)
        lu.assertEquals(date, nil)
        lu.assertEquals(participants,nil)
    end
    function TestBooking:test2b() -- par un client
        local status = nil;
        local date = nil;

        status, date = booking.showOne(url,tokenSess2, bookId)

        lu.assertEquals(status, 200)
        lu.assertEquals(date, "2018-05-04T13:30:00.000Z")
    end
    function TestBooking:test2c() -- par un admin
        local status = nil;
        local date = nil;

        status, date = booking.showOne(url,tokenSessAdmin, bookId)

        lu.assertEquals(status, 200)
        lu.assertEquals(date, "2018-05-04T13:30:00.000Z")
    end

    -- afficher les réservations d'un compte
    function TestBooking:test3a() -- par un proprio
        local status = nil;
        local dates = nil;

        status, dates = booking.showByAcc(url, tokenSess2, clientId2)

        lu.assertEquals(dates.date,"2018-05-04T13:30:00.000Z")
        lu.assertEquals(status, 200)
    end
    function TestBooking:test3b() -- par un client inconnu
        local status = nil;
        local dates = nil;

        status, dates = booking.showByAcc(url, tokenSess1, clientId2)

        lu.assertEquals(dates.date,nil)
        lu.assertEquals(status, 403)
    end
    function TestBooking:test3c() -- par un admin
        local status = nil;
        local dates = nil;

        status, dates = booking.showByAcc(url, tokenSessAdmin, clientId2)

        lu.assertEquals(dates.date,"2018-05-04T13:30:00.000Z")
        lu.assertEquals(status, 200)
    end

    -- modifier une réservation
    function TestBooking:test4a() -- par un proprio
        local status = nil;
        local statusTwo = nil;
        local date = nil;

        status = booking.modify(url, tokenSess2, bookId, "2015-10-22T08:30:00.000Z", clientId2, adminId )
        statusTwo, date = booking.showOne(url,tokenSess2, bookId)
        
        lu.assertEquals(status, 200)
        lu.assertEquals(date, "2015-10-22T08:30:00.000Z")
        lu.assertEquals(statusTwo, 200)
    end
    function TestBooking:test4b() -- par un client inconnu
        local status = nil;
        local statusTwo = nil;
        local date = nil;

        status = booking.modify(url, tokenSess1, bookId, "2020-05-30T12:30:00.000Z", clientId1, clientId2 )
        statusTwo, date = booking.showOne(url,tokenSess2, bookId)
        
        lu.assertEquals(status, 403)
        lu.assertEquals(date, "2015-10-22T08:30:00.000Z")
        lu.assertEquals(statusTwo, 200)
    end
    function TestBooking:test4c() -- par un admin
        local status = nil;
        local statusTwo = nil;
        local date = nil;

        status = booking.modify(url, tokenSessAdmin, bookId, "2013-03-03T13:30:00.000Z", clientId1, adminId )
        statusTwo = booking.showOne(url,tokenSess2, bookId)
        statusThree, date = booking.showOne(url, tokenSess1, bookId)
        
        lu.assertEquals(status, 200)
        lu.assertEquals(statusTwo, 403)
        lu.assertEquals(statusThree, 200)
        lu.assertEquals(date, "2013-03-03T13:30:00.000Z")
    end

    -- supprimer une réservation
    function TestBooking:test5a() -- par un client inconnu
        local status = nil;
        status = booking.del(url, tokenSess2, bookId)
        lu.assertEquals(status, 403)
    end
    function TestBooking:test5b() -- par un client
        local status = nil;
        status = booking.del(url, tokenSess1, bookId)
        lu.assertEquals(status, 200)
    end
--#endregion


-- suppression de compte
function test9a()
    local status = 0;
    status = acc.del(url, clientId2, tokenSess1, clientId1) -- par un autre client
    lu.assertEquals(status, 403) 
end
function test9b()
    local status = 0;
    status = acc.del(url, clientId1, tokenSess1, clientId1) -- suppression par proprio
    lu.assertEquals(status, 200)
end
function test9c()
    local status = 0;
    status = acc.del(url, clientId2, tokenSessAdmin, adminId) --suppression par admin
    lu.assertEquals(status, 200)
end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )
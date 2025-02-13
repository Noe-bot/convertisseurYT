var express = require('express');
var app = express();
var ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

app.listen(4000, function(){
    console.log("listening on 4000");
});

app.get('/download', function(req, res) {
    var link = req.query.url;

    // Extraire le nom de la vidéo de l'URL
    var videoInfo = ytdl.getBasicInfo(link);
    videoInfo.then(info => {

        const sanitizedTitle = info.videoDetails.title.replace(/\//g, '');
        const fileName = sanitizedTitle + '.mp3'; 
        const video = ytdl(link, { filter: 'audioonly' });

        video.pipe(fs.createWriteStream(fileName));

        // Attendez que l'écriture soit terminée, puis renvoyez le fichier au client
        video.on('end', function () {
            res.download(fileName, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Téléchargement terminé');
                    // Vous pouvez supprimer le fichier ici si nécessaire
                    fs.unlink(fileName, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des informations de la vidéo.');
    });
});
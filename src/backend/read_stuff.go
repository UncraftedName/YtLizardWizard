package main

import (
	"errors"
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/vmihailenco/msgpack/v5"
)

type objId uint64
type objStatus string

const (
	ObjStatusAvailable     objStatus = "AVAILABLE"
	ObjStatusNotAvailable  objStatus = "NOT_AVAILABLE"
	ObjStatusNotFound      objStatus = "SOURCE_NOT_FOUND"
	ObjStatusNotInPlaylist objStatus = "NOT_IN_PLAYLIST"
)

const (
	MsgSendTypeInit   string = "INIT"
	MsgSendTypePl     string = "PLAYLIST_INFO_UPDATE"
	MsgSendTypeChan   string = "CHANNEL_INFO_UPDATE"
	MsgSendTypeVid    string = "VIDEO_INFO_UPDATE"
	MsgSendTypeThumb  string = "THUMBNAIL_DATA_UPDATE"
	MsgSendTypeAudio  string = "AUDIO_DATA_UPDATE"
	MsgSendTypeDelete string = "DELETE"
)

type ClientMsg struct {
	What      string `msgpack:"what"`
	RequestId any    `msgpack:"requestId"`
	Data      any    `msgpack:"data"`
}

type ServerMsg struct {
	What      string `msgpack:"what"`
	RequestId any    `msgpack:"requestId"`
	Final     bool   `msgpack:"final"`
	Data      any    `msgpack:"data"`
	Error     string `msgpack:"error"`
}

type renameRulesSendData struct {
	Id          objId    `msgpack:"id"`
	AlbumRules  []string `msgpack:"albumRules"`
	NameRules   []string `msgpack:"nameRules"`
	ArtistRules []string `msgpack:"artistRules"`
}

type playlistSendData struct {
	Id             objId     `msgpack:"id"`
	Version        objId     `msgpack:"version"`
	Name           string    `msgpack:"name"`
	Url            string    `msgpack:"url"`
	OwnerChannelId objId     `msgpack:"ownerChannelId"`
	NumVideos      uint64    `msgpack:"numVideos"`
	Status         objStatus `msgpack:"status"`
	RenameRulesId  objId     `msgpack:"renameRulesId"`
}

type channelSendData struct {
	Id            objId     `msgpack:"id"`
	Version       objId     `msgpack:"version"`
	Name          string    `msgpack:"name"`
	Url           string    `msgpack:"url"`
	NumVideos     uint64    `msgpack:"numVideos"`
	Status        objStatus `msgpack:"status"`
	RenameRulesId objId     `msgpack:"renameRulesId"`
}

type videoSendData struct {
	Id            objId     `msgpack:"id"`
	Version       objId     `msgpack:"version"`
	Name          string    `msgpack:"name"`
	Url           string    `msgpack:"url"`
	LengthMs      uint64    `msgpack:"lenMs"`
	thumbnailId   objId     `msgpack:"thumbnailId"`
	Status        objStatus `msgpack:"status"`
	RenameRulesId objId     `msgpack:"renameRulesId"`
}

type thumbnailSendData struct {
	Id         objId  `msgpack:"id"`
	Version    objId  `msgpack:"version"`
	Data       []byte `msgpack:"thumbnail"`
	FileFormat string `msgpack:"fileFormat"`
}

type audioSendData struct {
	Id         objId  `msgpack:"id"`
	Version    objId  `msgpack:"version"`
	Data       []byte `msgpack:"audio"`
	FileFormat string `msgpack:"fileFormat"`
}

func processMsg(hData *handlerData, msg ClientMsg, msgLen int) error {
	if msg.What == "" {
		return errors.New("msg.what is not specified")
	}
	if msg.RequestId == nil {
		return errors.New("no requestId")
	}

	hData.lg.Printf("<-- received message \"%s\" (%d bytes).\n", msg.What, msgLen)

	quickSend := func(data *ServerMsg) {
		b, err := msgpack.Marshal(data)
		if err != nil {
			panic(err)
		}
		hData.lg.Printf("--> \"%s\" (%d bytes)\n", data.What, len(b))
		err = hData.conn.WriteMessage(
			websocket.BinaryMessage,
			b,
		)
		if err != nil {
			panic(err)
		}
	}

	switch msg.What {
	case "INIT":
		quickSend(&ServerMsg{
			What:      MsgSendTypeInit,
			RequestId: msg.RequestId,
			Final:     true,
			Data: map[string]any{
				"appVersion": "0.1",
				"newFile":    false,
			},
		})
	case "GET_PLAYLISTS":
		quickSend(&ServerMsg{
			What:      MsgSendTypePl,
			RequestId: msg.RequestId,
			Final:     true,
			Data: []playlistSendData{
				{
					Id:             58,
					Version:        1,
					Name:           "Solo Piano",
					Url:            "https://www.youtube.com/playlist?list=PLDo9og182sSAzbE4-ZpHeH618H780L-Vn",
					OwnerChannelId: 85,
					NumVideos:      101,
					Status:         ObjStatusAvailable,
					RenameRulesId:  78,
				},
				{
					Id:             61,
					Version:        2,
					Name:           "Music to dab to",
					Url:            "https://www.youtube.com/playlist?list=PLgZsR4Jh0IEnqL60wd9L8bcl8fudduKwA",
					OwnerChannelId: 420,
					NumVideos:      249,
					Status:         ObjStatusAvailable,
					RenameRulesId:  34,
				},
			},
		})
	case "ADD_PLAYLISTS":
		quickSend(&ServerMsg{
			What:      MsgSendTypePl,
			RequestId: msg.RequestId,
			Final:     true,
			Data: []playlistSendData{
				{
					Id:             666,
					Version:        1,
					Name:           "🐻🐰[ULTIMATE FNAF MEME PLAYLIST❗]🐔🦊",
					Url:            "https://www.youtube.com/playlist?list=PLU29ljAVJIEfeLsoWNCAad7i9MUOUaPU4",
					OwnerChannelId: 95,
					NumVideos:      128,
					Status:         ObjStatusAvailable,
					RenameRulesId:  47,
				},
			},
		})
	case "GET_CHANNELS":
		quickSend(&ServerMsg{
			What:      MsgSendTypeChan,
			RequestId: msg.RequestId,
			Final:     true,
			Data: []channelSendData{
				{
					Id:            85,
					Version:       3,
					Name:          "ibi",
					Url:           "https://www.youtube.com/channel/UCDFD8RdIL2FxNfkKkus5RSQ",
					NumVideos:     101,
					Status:        ObjStatusAvailable,
					RenameRulesId: 101,
				},
				{
					Id:            420,
					Version:       3,
					Name:          "UncraftedName",
					Url:           "https://www.youtube.com/channel/UCfvCfHW2INoD_pnRZTab5RA",
					NumVideos:     249,
					Status:        ObjStatusAvailable,
					RenameRulesId: 102,
				},
				{
					Id:            95,
					Version:       2,
					Name:          "Urlocalcommenter",
					Url:           "https://www.youtube.com/@Commenter_101",
					NumVideos:     128,
					Status:        ObjStatusAvailable,
					RenameRulesId: 103,
				},
			},
		})
	case "DOWNLOAD_PLAYLISTS":
		quickSend(&ServerMsg{
			What:      MsgSendTypeChan,
			RequestId: msg.RequestId,
			Final:     false,
			Data: []channelSendData{
				{
					Id:            85,
					Version:       3,
					Name:          "ibi",
					Url:           "https://www.youtube.com/channel/UCDFD8RdIL2FxNfkKkus5RSQ",
					NumVideos:     101,
					Status:        ObjStatusAvailable,
					RenameRulesId: 101,
				},
			},
		})
		quickSend(&ServerMsg{
			What:      MsgSendTypeVid,
			RequestId: msg.RequestId,
			Final:     true,
			Data: []videoSendData{
				{
					Id:            45,
					Version:       8,
					Name:          "HOME - Discography",
					Url:           "https://youtu.be/MzCEqlPp0L8?si=IDxAs04WoSPzRW0U",
					LengthMs:      33019005,
					Status:        ObjStatusAvailable,
					RenameRulesId: 104,
				},
			},
		})
	case "GET_VIDEOS":
		quickSend(&ServerMsg{
			What:      MsgSendTypeVid,
			RequestId: msg.RequestId,
			Final:     true,
			Data: []videoSendData{
				{
					Id:            45,
					Version:       7,
					Name:          "HOME - Discography",
					Url:           "https://youtu.be/MzCEqlPp0L8?si=IDxAs04WoSPzRW0U",
					LengthMs:      33019005,
					Status:        ObjStatusAvailable,
					RenameRulesId: 104,
				},
				{
					Id:            47,
					Version:       1,
					Name:          "Madeon - Adventure (Continuous Mix)",
					Url:           "https://youtu.be/5nLd61N_V_A?si=DTT05vbMNj_pwWjt",
					LengthMs:      2444030,
					Status:        ObjStatusAvailable,
					RenameRulesId: 105,
				},
			},
		})
	case "DOWNLOAD_VIDEO_DATA":
		quickSend(&ServerMsg{
			What:      "NOT_IMPLEMENTED",
			RequestId: msg.RequestId,
			Final:     true,
			Data:      nil,
			Error:     "this message type is not implemented",
		})
	case "SET_VIDEOS_DOWNLOADABLE", "REORDER_PLAYLISTS":
		break
	default:
		return fmt.Errorf("invalid message type \"%s\"", msg.What)
	}

	return nil
}

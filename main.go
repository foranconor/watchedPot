package main

import (
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

const (
	web = "./web/"
)

var (
	home = filepath.Join(web, "index.html")
)

func main() {

	s := http.NewServeMux()
	/* Static Routes */
	s.HandleFunc("GET /", root)
	s.HandleFunc("GET /{file}", get)
	s.HandleFunc("GET /assets/", get)

	http.ListenAndServe(":6767", s)
}

func get(w http.ResponseWriter, r *http.Request) {
	fp := filepath.Join(web, r.URL.Path)
	serveFile(fp, w, r)
}

func root(w http.ResponseWriter, r *http.Request) {
	serveFile(home, w, r)
}

func serveFile(path string, w http.ResponseWriter, r *http.Request) {
	ext := filepath.Ext(path)
	if len(ext) == 0 {
		serveFile(home, w, r)
	}
	_, err := os.Stat(path)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	ct := mime.TypeByExtension(ext)
	w.Header().Set("Content-Type", ct)
	http.ServeFile(w, r, path)
}

package main

import (
	"fmt"
	"math"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

const (
	web = "./web/"
)

var (
	home = filepath.Join(web, "index.html")
)

func Cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Middleware(next http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for _, middleware := range middlewares {
		next = middleware(next)
	}
	return next
}

func main() {

	s := http.NewServeMux()
	/* Static Routes */
	s.HandleFunc("GET /", root)
	s.HandleFunc("GET /{file}", get)
	s.HandleFunc("GET /assets/", get)
	s.HandleFunc("GET /pics/{timestamp}", getPic)

	middleware := Middleware(s, Cors)

	http.ListenAndServe(":6767", middleware)
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

func getPic(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	dir := filepath.Join(web, "pics")
	// get a list of files in the directory
	files, err := os.ReadDir(dir)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(files)
	// get the file name from the request
	when, err := strconv.Atoi(r.PathValue("timestamp"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// get closest file
	closest := math.MaxInt64
	closestFile := files[0].Name()
	for _, file := range files {
		millis, err := strconv.Atoi(strings.Split(file.Name(), ".")[0])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		distance := millis - when
		if distance < 0 {
			distance = distance * -1
		}
		fmt.Println(distance)
		if distance < closest {
			closest = distance
			closestFile = file.Name()
		}

	}
	fmt.Println(closestFile)
	fmt.Println(closest)
	serveFile(filepath.Join(dir, closestFile), w, r)
}

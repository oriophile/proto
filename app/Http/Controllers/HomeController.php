<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function editorSave(Request $request) {
        $relativeFileDir = ".";
        $fileDir = getCwd() . "/" . $relativeFileDir;
        $filePathComponents = explode("/", $request->page);
        $filePath = $fileDir . "/" . ltrim($request->page, $request->page[0]);
        $head = $request->head;
        $body = $request->body;
        try {
            $file = fopen($filePath, 'w');
            fwrite($file, '<!DOCTYPE html>');
            fwrite($file, '<html lang="en">');
            fwrite($file, $head);
            fwrite($file, $body);
            fwrite($file, '</html>');
            fclose($file);
        } catch(Exception $ex) {
            return $ex->getMessage();
        }
        return "hi";
    }
}

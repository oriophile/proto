<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/editor', 'HomeController@editor')->name('editor');
Route::post('/editor/save', 'HomeController@editorSave')->name('editor-save');

Route::get('/edit/{file}', function($file) {
    return public_path() . "/" . $file;
    return File::get(public_path() . "/" . $file);
});

Route::prefix('admin')->group(function() {
    Route::get('{test}', function($test) {
        echo $test;
    });
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

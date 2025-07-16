<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/test', [TestController::class, 'show']);

Route::post('/generate-upload-url', function (Request $request) {
    $request->validate([
        'filename' => 'required|string',
        'type' => 'required|string',
    ]);

    $disk = Storage::disk('s3');
    $client = $disk->getClient();
    $bucket = config('filesystems.disks.s3.bucket');

    $key = '' . uniqid() . '_' . $request->filename;

    $command = $client->getCommand('PutObject', [
        'Bucket' => $bucket,
        'Key' => $key,
        'ContentType' => $request->type,
        'ACL' => 'public-read',
    ]);

    $requestUrl = $client->createPresignedRequest($command, '+10 minutes');

    return response()->json([
        'url' => (string) $requestUrl->getUri(),
        'key' => $key,
    ]);
});
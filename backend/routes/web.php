use App\Http\Controllers\GameController;

Route::post('/join', [GameController::class, 'join'])->name('game.join');
Route::post('/leave', [GameController::class, 'leave'])->name('game.leave');
# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
#     return JSONResponse(content={"detail": jsonable_encoder(exc.errors())}, status_code=HTTP_400_BAD_REQUEST)

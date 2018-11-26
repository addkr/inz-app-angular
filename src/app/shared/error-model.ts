export class ErrorModel {

    public error(errorMessage): string{
        var result = "";
        switch(errorMessage){
            case "Unknown Error":
                result = "Wsytąpił błąd podczas próby logowania";
                break;
            case "invalid_grant":
                result = "Niepoprawny login lub hasło";
                break;
            default:
                result = "Wsytąpił błąd podczas próby logowania";
                break;
        }
        return result;
    }
}

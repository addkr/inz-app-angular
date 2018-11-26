export class SharedResources{

    endpoint = "http://localhost:52084/";
   translateToPolish = [{format:'yyyy-mm-dd', selectYears: 130, selectMonths: true, max: true, 
  monthsFull: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ] ,
  monthsShort: [ 'Sty.', 'Lu.', 'Ma.', 'Kwi.', 'Maj', 'Cze.', 'Lip.', 'Sie.', 'Wrz.', 'Paź.', 'Lis.', 'Gru.' ],
	weekdaysFull: [ 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota' ],
	weekdaysShort: [ 'Ndz.', 'Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sb.' ],
	weekdaysLetter: [ 'N', 'P', 'W', 'Ś', 'Cz', 'P', 'S' ],
	today: 'Dzisiaj',
	clear: 'Anuluj',
    close: 'Ok'}];

    educationOption = [{'value':'podstawowe'},{'value':'gimnazjalne'},{'value':'zawodowe'},{'value':'średnie'},{'value':'wyższe'},{'value':'brak'}]

    citizenshipoptions = [{'value': 'Polska'},{'value': 'Inna'}];
    sexoptions = [{'value':'M'},{'value':'K'},{'value':'Inne'}];
    loginOptions =  [{'name':'Pielęgniarka/położna','value':'nurse'},{'name':'Lekarz','value':'doctor'},{'name':'Pracownik recepcji','value':'reception'},{'name':'Pacjent','value':'patient'},{'name':'Administrator','value':'admin'}];
    medicalPersonel = [{'name':'Pielęgniarka/położna','value':'nurse'},{'name':'Lekarz','value':'doctor'},{'name':'Pracownik recepcji','value':'reception'}];
}


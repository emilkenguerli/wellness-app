class Booking {
    constructor(bookingID, staffId, team, service, start, end, note, student, canceled, dna) {
      this.bookingID = bookingID;
      this.staffId = staffId;
      this.team = team;
      this.service = service;
      this.start = start;
      this.end = end;
      this.note = note;
      this.student = student;
      this.canceled = canceled;
      this.dna = dna;
    }
}
  
export default Booking;
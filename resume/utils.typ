// Helper Functions
#let monthname(n, display: "short") = {
  n = int(n)
  let month = ""
  let short = ""

  if n == 1 {
    month = "January"
    short = "Jan"
  } else if n == 3 {
    month = "March"
    short = "Mar"
  } else if n == 2 {
    month = "February"
    short = "Feb"
  } else if n == 4 {
    month = "April"
    short = "Apr"
  } else if n == 5 {
    month = "May"
    short = "May"
  } else if n == 6 {
    month = "June"
    short = "June"
  } else if n == 7 {
    month = "July"
    short = "July"
  } else if n == 8 {
    month = "August"
    short = "Aug"
  } else if n == 9 {
    month = "September"
    short = "Sept"
  } else if n == 10 {
    month = "October"
    short = "Oct"
  } else if n == 11 {
    month = "November"
    short = "Nov"
  } else if n == 12 {
    month = "December"
    short = "Dec"
  }

  if display == "short" {
    short
  } else {
    month
  }
}

#let strpdate(isodate) = {
  let date = ""
  if isodate == "" {
    return none
  } else if lower(isodate) != "present" {
    let year = int(isodate.slice(0, 4))
    let month = int(isodate.slice(5, 7))
    let day = int(isodate.slice(8, 10))
    let monthName = monthname(month, display: "short")
    date = datetime(year: year, month: month, day: day)
    date = monthName + " " + date.display("[year repr:full]")
  } else if lower(isodate) == "present" {
    date = "Present"
  }
  return date
}

#let daterange(start, end) = {
  if start != none and end != none [
    #start - #end
  ]
  if start == none and end != none [
    #end
  ]
  if start != none and end == none [
    #start
  ]
}

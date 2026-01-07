#import "cv.typ": *

#let cvdata = toml("data.toml")
#let config = toml("config.toml")
#let projects = toml("projects.toml")

#let uservars = (
  headingfont: "Norwester",
  bodyfont: "Raleway",
  fontsize: 11.5pt,
  linespacing: 5pt,
  sectionspacing: -4pt,
  showAddress: false,
  showNumber: false,
  showTitle: true,
  headingsmallcaps: true,
  sendnote: false,
)

#let ymargin = 0.5cm;
#let xmargin = 1.15cm;

#let customrules(doc) = {
  set page(paper: "us-letter", margin: (
    top: ymargin,
    left: xmargin,
    right: xmargin,
    bottom: ymargin,
  ))

  doc
}

#let cvinit(doc) = {
  doc = setrules(uservars, doc)
  doc = showrules(uservars, doc)
  doc = customrules(doc)

  doc
}

#show: doc => cvinit(doc)

#let icon_size = 0.9em;
#let contact-item(icon, content, baseline: 25%) = box[#box(baseline: baseline, width: 1.1em, image(icon, height: icon_size)) #h(3pt) #content]

// Header with name on left, links on right in 2x2 grid
#grid(
  columns: (1fr, auto),
  align: (left + horizon, right + horizon),
  [
    #text(36pt, font: "Norwester")[ROHAN GODHA]
  ],
  [
    #set text(9.5pt, font: "Raleway")
    #table(
      columns: (auto, auto),
      stroke: none,
      inset: (x: 8pt, y: 3pt),
      align: (left, left),
      contact-item("./icons/website.svg", link("https://" + cvdata.personal.website)[#cvdata.personal.website]),
      contact-item("./icons/email.svg", link("mailto:" + cvdata.personal.email)[#cvdata.personal.email]),
      contact-item("./icons/linkedin.svg", link("https://" + cvdata.personal.linkedin)[#cvdata.personal.linkedin.replace("linkedin.com", "")]),
      contact-item("./icons/github.svg", link("https://" + cvdata.personal.github)[#cvdata.personal.github]),
    )
  ],
)
#v(2pt)

#cvwork(cvdata)
#cveducation(cvdata, config)
#cvprojects(cvdata, config, projects)
#cvskills(cvdata, config)

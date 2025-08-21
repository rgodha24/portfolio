#import "cv.typ": *

#let cvdata = toml("data.toml")
#let config = toml("config.toml")
#let projects = toml("projects.toml")

#let uservars = (
  headingfont: "Norwester",
  bodyfont: "Raleway",
  fontsize: 11.5pt, // 10pt, 11pt, 12pt
  linespacing: 5pt,
  sectionspacing: -4pt,
  showAddress: false, // true/false show address in contact info
  showNumber: false, // true/false show phone number in contact info
  showTitle: true, // true/false show title in heading
  headingsmallcaps: false, // true/false use small caps for headings
  sendnote: false, // set to false to have sideways endnote
)

#let accent = rgb("#38BDF9");
#let dark = rgb("#232526");
#let light = white;
#let ymargin = 1cm;
#let xmargin = 1.15cm;
#let rect_height = 90pt;

#let customrules(doc) = {
  set page(paper: "us-letter", margin: (
    top: ymargin + rect_height,
    left: xmargin,
    right: xmargin,
    bottom: ymargin,
  ))

  doc
}

#set text(fill: dark)

#let cvinit(doc) = {
  doc = setrules(uservars, doc)
  doc = showrules(uservars, doc)
  doc = customrules(doc)

  doc
}

#show: doc => cvinit(doc)

#place(left + top, dx: -xmargin, dy: -ymargin - rect_height)[
  #rect(
    fill: dark,
    radius: (bottom-right: 10000pt),
    inset: (left: xmargin, right: 20pt, top: ymargin, bottom: 15pt),
    [
      #text(45pt, font: "Norwester", fill: accent)[ROHAN GODHA]\
      #pad(top: -5pt)[
        #text(
          12pt,
          font: "Raleway",
          fill: accent,
          weight: "bold",
        )[#cvdata.personal.title]
      ]
    ],
  )
]

#let icon_size = 1em;
#let link_height = 72pt;

#place(right + top, dy: -ymargin - 70pt)[
  #box(height: link_height, width: 32%)[
    #place(horizon)[
      #align(left)[
        #stack(
          if config.includeLocation [
            #stack(
              dir: ltr,
              spacing: 1em,
              image("./icons/location.svg", height: icon_size),
              h(1fr),
              text(icon_size)[#cvdata.personal.location],
            )
          ] else [],
          stack(
            dir: ltr,
            spacing: 1em,
            image("./icons/website.svg", height: icon_size),
            h(1fr),
            link("https://" + cvdata.personal.website)[#text(
                icon_size,
              )[#cvdata.personal.website]],
          ),
          spacing: 1fr,
          stack(
            dir: ltr,
            spacing: 1em,
            image("./icons/email.svg", height: icon_size),
            h(1fr),
            link("mailto:" + cvdata.personal.email)[#text(
                icon_size,
              )[#cvdata.personal.email]],
          ),
          stack(
            dir: ltr,
            spacing: 1em,
            image("./icons/github.svg", height: icon_size),
            h(1fr),
            link("https://" + cvdata.personal.github)[#text(
                icon_size,
              )[#cvdata.personal.github]],
          ),
          stack(
            dir: ltr,
            spacing: 1em,
            image("./icons/instagram.svg", height: icon_size),
            h(1fr),
            link("https://" + cvdata.personal.instagram)[#text(
                icon_size,
              )[#cvdata.personal.instagram]],
          ),
          stack(
            dir: ltr,
            spacing: 1em,
            image("./icons/linkedin.svg", height: icon_size),
            h(1fr),
            link("https://" + cvdata.personal.linkedin)[#text(
                icon_size,
              )[#cvdata.personal.linkedin]],
          ),
        )
      ]
    ]
  ]
]

#v(-15pt)

#cvwork(cvdata)
#cveducation(cvdata, config)
#cvaffiliations(cvdata)
#cvprojects(cvdata, config, projects)
#cvskills(cvdata, config)

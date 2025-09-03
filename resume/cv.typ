#import "utils.typ"

#let setrules(uservars, doc) = {
  set text(
    font: uservars.bodyfont,
    size: uservars.fontsize,
    hyphenate: false,
    ligatures: false,
  )

  set list(spacing: uservars.linespacing)

  set par(leading: uservars.linespacing, justify: true)

  doc
}

// show rules
#let showrules(uservars, doc) = {
  // Uppercase section headings
  show heading.where(level: 2): it => block(width: 100%)[
    #v(uservars.sectionspacing)
    #set align(left)
    #set text(font: uservars.headingfont, size: 1.2em, weight: "bold")
    #if (uservars.at("headingsmallcaps", default: false)) {
      smallcaps(it.body)
    } else {
      upper(it.body)
    }
    #v(-0.9em) #line(length: 100%, stroke: 1pt + black) // draw a line
  ]

  // Name title/heading
  show heading.where(level: 1): it => block(width: 100%)[
    #set text(font: uservars.headingfont, size: 1.5em, weight: "bold")
    #if (uservars.at("headingsmallcaps", default: false)) {
      smallcaps(it.body)
    } else {
      upper(it.body)
    }
    #v(2pt)
  ]

  doc
}

// Set page layout
#let cvinit(doc) = {
  doc = setrules(doc)
  doc = showrules(doc)

  doc
}

// Job titles
#let jobtitletext(info, uservars) = {
  if uservars.showTitle {
    block(width: 100%)[
      *#info.personal.titles.join("  /  ")*
      #v(-4pt)
    ]
  } else {
    none
  }
}

// Address
#let addresstext(info, uservars) = {
  if uservars.showAddress {
    // Filter out empty address fields
    let address = info
      .personal
      .location
      .pairs()
      .filter(it => (
        it.at(1) != none and str(it.at(1)) != ""
      ))
    // Join non-empty address fields with commas
    let location = address.map(it => str(it.at(1))).join(", ")

    block(width: 100%)[
      #location
      #v(-4pt)
    ]
  } else {
    none
  }
}

#let contacttext(info, uservars) = block(width: 100%)[
  #let profiles = (
    box(link("mailto:" + info.personal.email)),
    if uservars.showNumber {
      box(link("tel:" + info.personal.phone))
    } else {
      none
    },
    if info.personal.url != none {
      box(link(info.personal.url)[#info.personal.url.split("//").at(1)])
    },
  ).filter(it => it != none) // Filter out none elements from the profile array

  #if info.personal.profiles.len() > 0 {
    for profile in info.personal.profiles {
      profiles.push(box(link(profile.url)[#profile.url.split("//").at(1)]))
    }
  }

  #set text(
    font: uservars.bodyfont,
    weight: "medium",
    size: uservars.fontsize * 1,
  )
  #pad(x: 0em)[
    #profiles.join([#sym.space.en #sym.diamond.filled #sym.space.en])
  ]
]

#let cvheading(info, uservars) = {
  align(center)[
    = #info.personal.name
    #jobtitletext(info, uservars)
    #addresstext(info, uservars)
    #contacttext(info, uservars)
  ]
}

#let cvwork(info, title: "Experience", isbreakable: true) = {
  if info.work != none {
    block[
      == #title
      #for w in info.work {
        let start = utils.strpdate(w.startDate)
        let end = utils.strpdate(w.endDate)
        let index = 0
        block(width: 100%, breakable: isbreakable)[
          #if index == 0 [#v(-0.2em)] else [#v(-0.5em)]
          #text(size: 13pt)[*#w.position*], _#link("https://" + w.url)[#w.organization]_ #h(1fr) #text(style: "italic")[#utils.daterange(start, end)] \
        ]
        v(-0.7em)
        if w.highlights.len() > 0 {
          for hi in w.highlights [
            - #eval(hi, mode: "markup")
          ]
          v(-0.5em)
        } else { v(0.25em) }
        index += 1
      }
      #v(0.25em)
    ]
  }
}

#let educationdates(config) = {
  if config.twentysix {
    utils.daterange(none, utils.strpdate("2026-05-01"))
  } else {
    utils.daterange(utils.strpdate("2024-08-01"), utils.strpdate("2027-05-01"))
  }
}

#let cveducation(info, config, title: "Education", isbreakable: true) = {
  if info.education != none {
    let index = 0
    block[
      == #title
      #for edu in info.education {
        let start = utils.strpdate(edu.startDate)
        let end = utils.strpdate(edu.endDate)

        let edu-items = ""
        if edu.honors != none and edu.honors.len() != 0 {
          edu-items = edu-items + "- *Honors*: " + edu.honors.join(", ") + "\n"
        }
        if edu.courses != none and edu.courses.len() != 0 {
          edu-items = (
            edu-items + "- *Courses*: " + edu.courses.join(", ") + "\n"
          )
        }
        if edu.highlights != none {
          for hi in edu.highlights {
            edu-items = edu-items + "- " + hi + "\n"
          }
          edu-items = edu-items.trim("\n")
        }

        // Create a block layout for each education entry
        block(width: 100%, breakable: isbreakable)[
          #if index == 0 [#v(-0.2em)] else [#v(-0.5em)]
          *#link("https://" + edu.url)[#text(13pt)[#edu.institution]]* #h(1fr) _#educationdates(config)_ \
          #if edu.area != "" [
            #text(
              style: "italic",
            )[#edu.studyType in #edu.area with concentrations in #edu.concentrations.at(0) and #edu.concentrations.at(1)] #h(
              1fr,
            )\
          ]
          #eval(edu-items, mode: "markup")
        ]

        index += 1
      }
    ]
  }
}

#let cvaffiliations(
  info,
  title: "Activities",
  isbreakable: true,
) = {
  if info.affiliations != none {
    block[
      == #title
      #let index = 0
      #for org in info.affiliations {
        let start = utils.strpdate(org.startDate)
        let end = utils.strpdate(org.endDate)

        block(width: 100%, breakable: isbreakable)[
          #if index == 0 [#v(-0.2em)] else [#v(-0.5em)]
          *#link("https://" + org.url)[#text(13pt)[#org.organization]]*, #org.position #h(1fr) _#utils.daterange(start, end)_
          #if org.highlights != none {
            for hi in org.highlights [
              - #eval(hi, mode: "markup")
            ]
          } else { }
        ]
        index += 1
      }
    ]
  }
}

#let cvprojects(
  info,
  config,
  projects,
  title: "Projects",
  isbreakable: true,
) = {
  let index = 0
  block[
    == #title
    #for p in config.projects {
      let project = projects.at(p)
      block(width: 100%, breakable: isbreakable)[
        #if index == 0 [#v(-0.2em)] else [#v(-0.5em)]
        *#text(13pt)[#link("https://rgodha.com/" + p)[#project.title]]* #h(1fr) _ #link("https://rgodha.com/" + p)[rgodha.com/#p] _\
        #for hi in project.bullets [
          - #eval(hi, mode: "markup")
        ]
      ]
      index += 1
    }
  ]
}

#let cvcertificates(
  info,
  title: "Licenses and Certifications",
  isbreakable: true,
) = {
  if info.certificates != none {
    block[
      == #title

      #for cert in info.certificates {
        // Parse ISO date strings into datetime objects
        let date = utils.strpdate(cert.date)
        // Create a block layout for each certificate entry
        block(width: 100%, breakable: isbreakable)[
          // Line 1: Certificate Name and ID (if applicable)
          #if cert.url != none [
            *#link(cert.url)[#cert.name]* #h(1fr)
          ] else [
            *#cert.name* #h(1fr)
          ]
          #if "id" in cert.keys() and cert.id != none and cert.id.len() > 0 [
            ID: #raw(cert.id)
          ]
          \
          // Line 2: Issuer and Date
          Issued by #text(style: "italic")[#cert.issuer] #h(1fr) #date \
        ]
      }
    ]
  }
}

#let cvpublications(
  info,
  title: "Research and Publications",
  isbreakable: true,
) = {
  if info.publications != none {
    block[
      == #title
      #for pub in info.publications {
        // Parse ISO date strings into datetime objects
        let date = utils.strpdate(pub.releaseDate)
        // Create a block layout for each publication entry
        block(width: 100%, breakable: isbreakable)[
          // Line 1: Publication Title
          #if pub.url != none [
            *#link(pub.url)[#pub.name]* \
          ] else [
            *#pub.name* \
          ]
          // Line 2: Publisher and Date
          #if pub.publisher != none [
            Published on #text(style: "italic")[#pub.publisher] #h(1fr) #date \
          ] else [
            In press \
          ]
        ]
      }
    ]
  }
}

#let cvskills(
  info,
  config,
  title: "Skills",
  isbreakable: true,
) = {
  if info.skills != none {
    block(breakable: isbreakable)[
      == #title
      #if (info.skills != none) [
        #for group in info.skills [
          - *#group.category*: #group.skills.join(", ")
        ]
      ]
    ]
  }
}

#let cvreferences(info, title: "References", isbreakable: true) = {
  if info.references != none {
    block[
      == #title
      #for ref in info.references {
        block(width: 100%, breakable: isbreakable)[
          #if ref.url != none [
            - *#link(ref.url)[#ref.name]*: "#ref.reference"
          ] else [
            - *#ref.name*: "#ref.reference"
          ]
        ]
      }
    ]
  } else { }
}

#let endnote(uservars) = {
  if uservars.sendnote {
    place(
      bottom + right,
      dx: 9em,
      dy: -7em,
      rotate(
        -90deg,
        block[
          #set text(size: 4pt, font: "IBM Plex Mono", fill: silver)
          \*This document was last updated on #datetime.today().display("[year]-[month]-[day]") using #strike(stroke: 1pt)[LaTeX] #underline(link("https://typst.app/home")[*Typst*]). \
        ],
      ),
    )
  } else {
    place(
      bottom + right,
      block[
        #set text(size: 5pt, font: "Consolas", fill: silver)
        \*This document was last updated on #datetime.today().display("[year]-[month]-[day]") using #strike(stroke: 1pt)[LaTeX] #underline(link("https://typst.app/home")[*Typst*]). \
      ],
    )
  }
}

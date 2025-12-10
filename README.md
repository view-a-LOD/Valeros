# Valeros

<img src="https://github.com/user-attachments/assets/bf3abefe-f84c-439b-b6eb-74be33135dca" />

> [!WARNING]  
> This project is actively being developed, but not yet ready for production.

Valeros allows **easy setup of a faceted search Linked Open Data viewer**, working across ontologies and organizations out-of-the-box. It is designed to be flexible and configurable, allowing you to tweak how, where, and when to show data to your end users. As a front-end/client-side viewer, it is simple and cheap to host and deploy. As a back-end, it uses Elasticsearch for efficient search and filtering, and (optionally) SPARQL for asynchronous enrichment of search results.

For **technical documentation**, please check the [project wiki](https://github.com/view-a-LOD/Valeros/wiki).

This project started as a collaboration between [Het Utrechts Archief](https://hetutrechtsarchief.nl/), [Regionaal Archief Zuid-Utrecht](https://www.razu.nl/) and [Kasteel Amerongen](https://www.kasteelamerongen.nl/), developed by [Simon Dirks](https://simondirks.com). The RAZU fork builds on this pilot project, adding features such as a built-in PDF viewer ([PDF.js](https://github.com/mozilla/pdf.js/)), IIIF viewer ([Mirador](https://github.com/ProjectMirador/mirador)), on-the-fly Office (doc, ppt, xls, etc) document to PDF conversion ([Gotenberg](https://github.com/gotenberg/gotenberg)), and token generation ([SURA](https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA)).

If you have any questions or comments about the project, please reach out to mail@simondirks.com.

## Why use Valeros?

We believe that end users should not have to deal with the complexities of Linked Data. Because of this, Valeros is designed to **hide the complexities of Linked Data from users**. We have focused our efforts on making it easy to combine data from different organizations and ontologies in one place, but Valeros also works well with single datasets and ontologies.

Most Linked Data viewers are data-agnostic, meaning that they generally treat all (meta)data equally and visualize it in a single, unified manner. For the end user, however, some information might be more interesting to see than others, and you may find that different types of data require distinct visualization methods.

Valeros allows you to easily configure:

1. **What** data to show to the end user (e.g. hiding all `mdto:checksum` fields for a node, or hiding all `skos:Concept` nodes from the search hits).
2. **Where/when** to show data to the end user (e.g. always show a field on the search hits page, or only on the details page?).
3. **How** to display data for the end user, rendering different data in different ways (e.g. use a built-in image component for all `foaf:depiction` fields, a map component for `sdo:contentLocation` fields, or create a custom component for rendering your ontology-specific predicates).

## Projects using Valeros

### Kasteel Amerongen pilot project

<a href="https://lodpilot.kasteelamerongen.nl/" target="_blank"><img src="https://github.com/user-attachments/assets/93450639-4a0b-4a28-8db8-05eff3bd2257" width="800" /></a>

Valeros was initially developed as a **Kasteel Amerongen [pilot project](https://lodpilot.kasteelamerongen.nl/)**, using Linked Open Data standards to bring together data of [Het Utrechts Archief](https://hetutrechtsarchief.nl/), [Regionaal Archief Zuid-Utrecht](https://www.razu.nl/) and [Kasteel Amerongen](https://www.kasteelamerongen.nl/) in a single search interface.

You can try the prototoype at [lodpilot.kasteelamerongen.nl](https://lodpilot.kasteelamerongen.nl).

For additional context, consider checking out the [NDE podcast](https://netwerkdigitaalerfgoed.nl/nieuws/podcast-paulus-en-de-nijs-op-reis-hoe-linked-data-verspreide-archieven-kasteel-amerongen-herenigt/) on the project.

### RAZU viewer

<img src="https://github.com/user-attachments/assets/bf3abefe-f84c-439b-b6eb-74be33135dca" width="800" />

The **[Regionaal Archief Zuid-Utrecht fork](https://github.com/Regionaal-Archief-Zuid-Utrecht/Valeros-RAZU/tree/develop)** is being actively developed, and extends the pilot project's functionality with various features such as:

1. A built-in PDF viewer ([PDF.js](https://github.com/mozilla/pdf.js/)).
2. IIIF viewer ([Mirador](https://github.com/ProjectMirador/mirador)).
3. On-the-fly Office (doc, ppt, xls, etc) document to PDF conversion ([Gotenberg](https://github.com/gotenberg/gotenberg)).
4. Token generation ([SURA](https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA)).

If of general (non-RAZU-specific) use, these features will be merged into the main repository in the near future.

## Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1, and uses [Tailwind CSS](https://tailwindcss.com/) for styling.

Run `ng serve` for a dev server. Run `ng build` to build the project.

If you run into node version issues, consider using something like [nvm](https://github.com/nvm-sh/nvm) (e.g., `nvm use 18`).

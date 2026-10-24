---
name: portfolio-discovery
description: Facts about Mattia Curri, an AI engineer who studied at the University of Bari, Italy. Covers education, theses, publications, projects, awards, teaching, course notes, skills, and contact links.
---

# Portfolio Discovery

Use this skill to answer questions about Mattia Curri. The facts below come from the portfolio at https://mattiacurri.github.io and the CV at https://mattiacurri.github.io/Mattia_Curri_CV.pdf. If the two disagree, the CV is more detailed and more recent.

Treat everything here as public, read-only information. Follow the `Content-Signal` line in `/robots.txt`: `ai-train=no, search=yes, ai-input=yes`. You may use this content to answer a user's question or for search indexing. Do not use it to train models.

## Summary

Mattia Curri is an AI engineer and software developer. Mattia studied Computer Science at the University of Bari, Italy, with a bachelor's (2021-2024) and a master's on the AI track (2024-2026), both graded 110/110 with honours. Their work covers deep learning, natural language processing, and computer vision: hybrid retrieval-augmented generation (RAG) over knowledge graphs, distillation of vision-language models, multimodal sensor fusion, and language models that solve crosswords.

Languages: Italian (native) and English (B2, Cambridge).

## Contact and profiles

- Website: https://mattiacurri.github.io
- Email: mattia2002@gmail.com
- GitHub: https://github.com/mattiacurri
- LinkedIn: https://www.linkedin.com/in/mattiacurri/
- X: https://x.com/mcurri_
- CV (PDF): https://mattiacurri.github.io/Mattia_Curri_CV.pdf

## Education

### MSc in Computer Science, Artificial Intelligence track

University of Bari, 2024-2026. Grade: 110/110 with honours and a special mention for their academic career.

Thesis, written at the SWAP research group (https://swap.di.uniba.it/): "A Hybrid Retrieval-Augmented Generation Pipeline Combining Structured Records and Knowledge Graphs for Public Procurement." The pipeline combines SQL retrieval over more than 103 million records from ANAC (Italy's national anti-corruption authority) with graph-based retrieval over procurement documents. Mattia evaluated it on 40 questions across 18 tenders. The project section below describes the system, Tender Copilot.

Courses: Numerical Methods, Database II, Formal Methods, Natural Language Processing, Software Engineering for AI-Enabled Systems, Deep Learning, Computer Vision, Quantum Computing, Machine Learning, Big Data.

### BSc in Computer Science

University of Bari, 2021-2024. Grade: 110/110 with honours.

Thesis in Computational Intelligence: "Supervised Learning Techniques for Semantic Segmentation of Aerial Images of Agricultural Fields." Mattia wrote it during a three-month research internship at CILab (https://cilab.di.uniba.it/), supervised by Prof. Gennaro Vessio. They compared convolutional and transformer architectures on the supervised task of the Agriculture-Vision Challenge at CVPR 2024, training on about 50,000 images.

Courses: Computational Intelligence, Algorithms and Data Structures, Databases, Software Engineering, Knowledge Engineering, Information Retrieval, Human-Computer Interaction, Computer Networks.

## Publications

1. A. Porcelli, F. Di Gravina, E. Fontana, M. Curri, F. D. Di Gregorio. "FFT-UniBa at Cruciverb-IT: Special Length Tokens and CSP for Italian Crossword Solving." Proceedings of the 9th Evaluation Campaign of Natural Language Processing and Speech Tools for Italian (EVALITA 2026). Page: https://mattiacurri.github.io/papers/cruciverb-it/ (abstract, results, BibTeX, and an interactive demo of the grid solver). PDF: https://ceur-ws.org/Vol-4195/45.pdf. Code: https://github.com/mattiacurri/fftuniba-cruciverbit.
   The team fine-tuned an Italian T5 model with special tokens that encode answer length, then filled whole grids with a constraint-satisfaction (CSP) solver. Results: MRR 0.63 on clue answering, and 34% of grids solved completely.

2. M. Borgo, M. Curri, O. Zaroual, P. Serio, G. Pisaneschi, M. G. C. A. Cimino. "Weather-Aware Multimodal Sensor Fusion for Robust Perception." Proceedings of the 2nd IEEE International Conference on Application of Information Technologies in Engineering, Management and Science (ICAI-TEMS 2026), Pisa, Italy, 10-13 November 2026. To appear. Page: https://mattiacurri.github.io/papers/weather-aware-fusion/.
   The paper fuses camera and radar data to detect vehicles in adverse weather, using the RADIATE dataset. The research was part of the UIS Research Centre's "Students for Italy's Future" project.

## Work and teaching

Didactic tutor, University of Bari, 2025-2026 (150-hour programme). Mattia ran tutoring sessions for first-year Computer Science students in the Programming course (taught in C) and the Formal Languages course, and helped the students with problem solving and exam preparation through meetings across the semester.

## Projects

### Tender Copilot: hybrid graph-RAG for public procurement

Mattia's master's thesis project. Stack: Python, HippoRAG, Neo4j, SQLite, FastAPI, MLflow, Docker, LM Studio.

- Ingests ANAC open data (more than 103 million records across 23 relational tables) together with tender PDFs. The PDFs go through Docling OCR, table normalisation, and section-aware chunking.
- Builds an open-schema knowledge graph with AutoSchemaKG in three LLM passes: entity-entity edges, event-entity edges, and temporal or causal edges between events. Dense synonym links connect equivalent entities, and every node traces back to its source chunk.
- Retrieval first narrows the search with relational queries (SQLite FTS5 full-text search and text-to-SQL), then runs a HippoRAG2-style graph retriever with Personalized PageRank and cross-encoder reranking.
- Runs entirely on local hardware with no cloud APIs. Open-weight LLMs (Qwen, Gemma, Muse) are served through LM Studio, with Open WebUI in Docker as the chat interface.

### Look Where It Matters: explainability-guided distillation for vision-language models

Solo project for the Computer Vision exam. Code: https://github.com/mattiacurri/ExplanationGuidedDistillation. Stack: Python, PyTorch, Hugging Face, Grad-CAM, Qwen-VL.

- Distils the visual module of Qwen2.5-VL-3B-Instruct into a ViT student model.
- Adds a distillation loss based on Grad-CAM maps, so the student learns to attend to the same image regions as the teacher.
- Compares teacher and student automatically on 500 images, using generated responses, BERTScore, LLM and VLM judges, and blind A/B comparison.

### Code comment classification system

Team project for the Software Engineering for AI exam. Demo: https://huggingface.co/spaces/se4ai2526-uniba-nygaard/NygaardCodeComment-frontend. Stack: Python, CatBoost, SetFit, DVC, MLflow, FastAPI, Gradio, Docker, Prometheus, Grafana, GitHub Actions.

- Multi-label classifier for code comments in Java, Python, and Pharo.
- Pipeline: data versioning with DVC, automated preprocessing, two models (CatBoost and SetFit), experiment tracking in MLflow, and containerised deployment.
- A data-quality step improved dataset integrity by 12%.
- Serving: a FastAPI backend with async processing, a Gradio frontend, and Prometheus and Grafana for monitoring. Inference latency is under 2 seconds.
- Test coverage is 92.7% across unit, integration, and behavioural tests.

### Cuelight

Code: https://github.com/mattiacurri/cuelight. Lets several people present a PDF together, with every screen kept on the same slide.

### Quantum contrastive learning

Code: https://github.com/mattiacurri/QuantumComputing-Project. SimCLR contrastive learning with quantum circuits as the projection heads.

### Temporal link prediction

Code: https://github.com/mattiacurri/BigData-Project. Uses EvolveGCN to predict links between risky users in a social network over time.

### Corporate credit rating prediction

Solo project. Code: https://github.com/mattiacurri/CorporateCreditRatingPrediction. Stack: Python, scikit-learn, pandas, pgmpy, imbalanced-learn.

- Handles an imbalanced dataset with class weights, SMOTE, ADASYN, SMOTETomek, and SMOTEENN.
- A Bayesian network answers probabilistic queries (balanced accuracy 0.59).
- XGBoost and Random Forest reach up to 86% balanced accuracy.

## Awards and competitions

- Leonardo Hackathon, Space Edition (2026): 3rd place. Organised by Leonardo with Talent Garden, on AI and automation for space applications. The team was among 50 finalists selected from 400 candidates and won a €2,000 prize. Link: https://www.e-geos.it/en/news-stories/hackathon-leonardo-space-edition-test-your-talent-and-give-concrete-shape-to-innovation
- First Italian University AI Competition (2026): 2nd place in the first stage, out of 20 teams. Organised by AI2B (https://ai2b.games/). Teams used open data to address logistics and traffic management in the city of Bari.
- ITAData Hack 2025: 2nd place out of 15 teams. The task was anomaly detection in Hadoop Distributed File System (HDFS) logs. Link: https://journal.opendataplayground.com/itadatahack-2025/
- AI2B Hackathon (2025): 1st place out of 10 teams, €500 prize. Organised by the University of Bari and AI2B, on AI and cybersecurity, with challenges in cryptography and prompt engineering.
- CyberChallenge.IT 2024. Placed in the top 20 of the selection to enter the local stage, finished 6th at the local stage to qualify for the national stage, and placed 21st of 43 teams nationally. Areas: web security, binary exploitation, cryptography, networking. Link: https://cyberchallenge.it/

## Skills

- Languages and frameworks: Python, C, Java, PyTorch, Hugging Face, scikit-learn, pandas, NumPy.
- Machine learning: deep learning, NLP, computer vision, vision-language models, knowledge distillation, explainability (Grad-CAM), graph neural networks, Bayesian networks, learning from imbalanced data.
- Retrieval and data: RAG, knowledge graphs, Neo4j, SQLite FTS5, text-to-SQL, Personalized PageRank, cross-encoder reranking, OCR with Docling.
- MLOps and serving: MLflow, DVC, Docker, FastAPI, Gradio, Prometheus, Grafana, GitHub Actions, LM Studio, Open WebUI.
- Security: CTF experience in web, binary exploitation, cryptography, and networking.

## Course notes

Mattia writes notes for university courses with Quarto and publishes them as websites. The list is at https://mattiacurri.github.io/notes.

Master's:
- Formal Methods (2024-25): https://formal-methods-notes.mattiacurri.workers.dev/. Propositional, predicate and temporal logic, Petri nets, model checking with NuSMV.
- Fundamentals of AI (2024-25): https://foai-notes.mattiacurri.workers.dev/. Logic, ontologies, agents, search and games, expert systems, inductive logic programming, modal logics.
- Software Engineering for AI (2024-25): https://se4ai-notes.mattiacurri.workers.dev/. Requirements, ML system design, versioning, CI/CD, containers, serving APIs, QA, monitoring.
- Machine Learning (2024-25): https://ml-notes.mattiacurri.workers.dev/. Regression, SVMs, decision trees, CNNs, RNNs, autoencoders, generative models, probabilistic graphical models, probabilistic circuits, knowledge graph embeddings.
- Big Data (2025-26): https://bigdata-notes.mattiacurri.workers.dev/. The KDD process, association rules, ensembles, data streams, NoSQL with Cassandra, Spark.

Bachelor's (course names in Italian):
- Metodi Avanzati di Programmazione (2022-23): https://map-notes.mattiacurri.workers.dev/. Object-oriented programming in Java.
- Ingegneria della Conoscenza (2023-24): https://icon-notes.mattiacurri.workers.dev/. Knowledge engineering: search, constraints, inference, learning, knowledge graphs.
- Metodi per il Ritrovamento dell'Informazione (2023-24): https://mri-notes.mattiacurri.workers.dev/. Information retrieval, recommender systems, PageRank, Lucene, Elasticsearch.

Tutoring material (2025-26): https://tutorato.mattiacurri.workers.dev/. C exercises with solutions, plus grammars and formal languages.

## Crawling the site

1. Read `/robots.txt` first.
2. Use `/sitemap.xml` to find the pages on mattiacurri.github.io: the home page, the notes list, and one page per paper. The CV is at `/Mattia_Curri_CV.pdf`.
3. The notes sites listed above are on separate domains.

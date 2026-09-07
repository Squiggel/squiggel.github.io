---
title: Dahu Quality
author: John Doe
date: 2026-09-07
---

# Dahu Quality
An imperfect but systemised and simple way to measure running improvement in a single number.

<figure class="wiki-img">
  <img src="/public/images/running-plot-auto.png" alt="Auto updating Dahu Quality plot">
  <figcaption>Subset of my runs where data was recorded correctly. Temperature only just started being recorded. This plot updates at midnight.</figcaption>
</figure>

## What is Dahu Quality for?
Feedback is widely recognised as being a key component in the process of improvement in any domain. If you want to *systematically* get better at something, you **must** understand how efforts relate to progress. Without this, the improvement process itself will remain dominated by the random influences and events that can both help and hinder improvement across different time scales. 
Getting quality feedback is hard. People aren't honest about how good you are, and correctly evaluating your own abilities is a vigorously shaken can of worms. I think many people recognise this dilemma, hence the global (and growing) obsession with Strava, Garmin and alike. These tools provide many of the core components for a deep analysis of your improvement in your sports domain (running for me). I have personally found them to be very helpful to corroborate or contradict my personal perceptions of my progress.
What is missing for those of us who value an empirical understanding of ourselves is a single metric that tells us how well we did in a single sporting event.
The use of a single metric to represent multiple factors in a sporting event may seem to some like a fetishisation of the data driven improvement process. Such an opinion ignores the astonishing skill of the average person to interpret a panel of metrics in an incredibly inconsistent way from day to day. I know I'm guilty, however hard I try, and I bet you are too.
A single pre-defined formula that brings together the main metrics available, and says how well you ran on a given day, is closed to interpretation as long as you agree that its conclusions are directionally correct. This is what the Dahu Quality aims to achieve.

## Quality
By my definition, the quality of a run is a ratio of how *difficult* it was to how much *effort* it took,
$$
Q=\frac{D}{E}
$$
This interpretation takes difficulty to mean the external factors that define a running route and require additional physiological energy to tackle. Effort is how hard an individual runner found the run. The less effort it takes to do a thing, the better a person is at doing it. So, we can say that Dahu Quality, $Q$, is how good at running you are.

## Difficulty
The difficulty of a run is poorly represented by its average metrics because there is no consistent distribution to fit and is often very unbalanced. Therefore I express the difficult of a run, $D$, as the sum of difficulty of its $n$ laps

$$
D_i =\sum_{i=1}^{n}{G_i \times d_i}
$$
1. Grade adjusted speed, $G_i$, measured in m/s
2. Distance of the lap, $d_i$, measured in m

#### Grade adjusted speed
Instead of formulating a new measure of the impact of elevation gain and loss throughout a lap, I have taken advantage of the existing grade adjusting speed metric. Through experience I have found it to be reasonably reliable, and better than I could formulate without doing my own controlled experiments.
This is calculated differently by different companies and watch models, but most share the same [foundational research](https://pubmed.ncbi.nlm.nih.gov/12183501/). As long as you continue to use the same device, there should be no issue. The value is calculated by your sports watch by applying an adjustment to your speed with the assumption that (in very simple terms) steeper up is always harder, shallow down is easier, and steep down hill running is harder than shallow downhill but not as hard as steep uphill. See [Aaron Schroeder's article](https://aaron-schroeder.github.io/reverse-engineering/grade-adjusted-pace.html) for a full explanation.

#### Accumulating difficulty
Looking over my historical data of personal runs I was unable to find any convincing argument that my laps got consistently slower or my heart rate at the same speed got higher. If anything, the data weakly suggests that I typically speed up over my runs. Therefore, I chose to leave out any measure that accounts for distance in previous laps. I admit this is intuitively not very satisfying as it seems difficulty should be related to effort so far.

## Effort
The most reliable and available way to measure personal effort is lap average heart rate, $h_i$. I recognise this is can be problematic for inter-person comparisons due to different resting heart rates and cross-sport cardiovascular advantages that don't translate to being good at running *per se*, but the main aim here is evaluation of individuals over time.

To account for unusually high temperatures giving the false impression of reduced run quality over a long term log, additional heartrate due to temperature is taken into account.
Overall run effort is
$$
E = \sum_{i=1}^{n}{(h_i - h(T))t_i}
$$

Where $h(T)$ is additional heart rate due to wet bulb temperature, and $t_i$ is the time duration of the lap. This means that effort is essentially the adjusted number of heart beats in a lap which makes sense since each heart beat is about the same amount of bodily effort.

Heart rate drift over time has not been taken into account because my personal experience, and my data, show that there is no clear trend. While I am currently unsure if I have a clear trend of heart rate being higher due to high temperatures, due to a lack of data collection, I am confident from personal physiological experience that runs of identical difficulty (same speed and distance) felt harder in heat.

#### Wet bulb adjustment
It is difficult to find a conclusive answer to this. Through the use of LLMs (*shame!*) I decided 3bpm/degree over 15 Celsius wet bulb.
$$
h(T) = 3(T-15), T \geq 15
$$

## Dimensional analysis
The dimensionality of the Dahu Quality metric is the same as area per time.
$$
\begin{aligned}
&Difficulty = L^2T^{-1} \\
&Effort =  T^{-1}T \\
&Qualitiy = L^2T^{-1}
\end{aligned}
$$

## Error
The actual error margin of the Dahu Quality is difficult to quantify because
1. Manufacturers are not entirely transparent
2. GPS connectivity and accuracy is variable
3. HR measurement accuracy varies between device types and models
4. HR measurement accuracy varies majorly between rates of change of effort

However, from dribs and drabs I can find I guestimate the Dahu quality to have an error of $\pm 5\%$ to $\pm 10\%$.
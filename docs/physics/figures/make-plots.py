import json,numpy as np,matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
p=Path(__file__).parent;d=json.loads((p/'model-data.json').read_text());o=np.array(d['osc']);c=np.array(d['chaos'])
plt.rcParams.update({'font.size':10,'axes.spines.top':False,'axes.spines.right':False,'savefig.bbox':'tight'})
f,ax=plt.subplots(figsize=(7,2.8));ax.plot(o[:,0],o[:,1]/10,label='10° release, normalized');ax.plot(o[:,0],o[:,2]/60,label='60° release, normalized');ax.plot(o[:,0],np.cos(np.sqrt(9.8/2.5)*o[:,0]),'--',color='gray',label='Small-angle formula');ax.set(xlim=(0,12),xlabel='Time (s)',ylabel='Angle / release angle');ax.legend(fontsize=8,ncol=2);ax.grid(alpha=.2);f.savefig(p/'oscillation.pdf');plt.close(f)
f,axs=plt.subplots(1,2,figsize=(7,2.8));axs[0].semilogy(c[:,0],np.maximum(c[:,1],1e-9),color='#147a88');axs[0].set(xlabel='Time (s)',ylabel='Distance between tips (model m)');axs[0].grid(alpha=.2);axs[1].plot(c[:,0],c[:,2],color='#8b468f');axs[1].set(xlabel='Time (s)',ylabel='Relative energy change');axs[1].ticklabel_format(axis='y',style='sci',scilimits=(0,0));axs[1].grid(alpha=.2);f.tight_layout();f.savefig(p/'sensitivity.pdf');plt.close(f)
f,ax=plt.subplots(figsize=(7,2.4));t=np.linspace(0,8,600);ax.plot(t,2.4*np.sin(1.6*t),color='#147a88');ax.axhline(0,color='gray',lw=.8);ax.set(xlabel='Game time (s)',ylabel='Wind acceleration (model m/s²)');ax.grid(alpha=.2);f.savefig(p/'wind.pdf');plt.close(f)

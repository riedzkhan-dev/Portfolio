window.NexusApi = {
  base: localStorage.getItem('nexus_api_url') || 'https://nexusflow-ai-backend.onrender.com/api',
  token: localStorage.getItem('nexus_token') || '',
  async request(path, options={}) {
    const res = await fetch(this.base + path, {
      ...options,
      headers: {'Content-Type':'application/json', ...(this.token?{Authorization:'Bearer '+this.token}:{}), ...(options.headers||{})}
    });
    const body = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(body.error || 'API request failed');
    return body;
  },
  async login(email='admin@nexusflow.dev',password='admin123'){
    const body=await this.request('/auth/login',{method:'POST',body:JSON.stringify({email,password})});
    this.token=body.token;localStorage.setItem('nexus_token',body.token);return body;
  },
  ask(prompt){return this.request('/ai/ask',{method:'POST',body:JSON.stringify({prompt})});},
  draft(prompt){return this.request('/ai/ticket-draft',{method:'POST',body:JSON.stringify({prompt})});},
  risks(){return this.request('/ai/risks');},
  summary(){return this.request('/ai/sprint-summary');}
};
